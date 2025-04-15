const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./Config/dbConfig");
const { Increment } = require("./services/metricsServices");

dotenv.config();
connectdb();

const { messageIdFetch, responseMailFetch } = require("./services/MessageFetch");
const { handleCallback } = require("./services/authService");
const { Mailpreprocessor } = require("./services/fetchMessageData");
const { queuePush } = require("./queues/queue");
const { MailSender } = require("./services/MailSender");

const PORT = process.env.PORT || 8103;
const exchange = process.env.EXCHANGE;
const routingKey = process.env.ROUTING_KEY_PUSH_NEW_MAIL;
const app = express();

app.use(express.json());

// Log wrapper
const log = ({ level, event, message, data }) => {
  console.log(JSON.stringify({
    level,
    service: "mail-service",
    event,
    message,
    data,
    timestamp: new Date().toISOString()
  }));
};

// Continuous consumer function to listen for new Mail IDs
const startMessageConsumer = async () => {
  try {
    await messageIdFetch(async (message) => {
      log({ level: "info", event: "mail_id_received", message: "Received new mail ID", data: { message } });
      Increment('mailService.mailIdPulled');

      const messageObject = JSON.parse(message);

      let result = await Mailpreprocessor(messageObject);
      result = {
        ...result,
        userEmail: messageObject.email,
      };

      const MailServiceMessage = JSON.stringify(result);
      await queuePush({ exchange, routingKey, message: MailServiceMessage });
      Increment('mailService.mailsPushed');

      log({ level: "info", event: "mail_pushed", message: "Mail pushed to exchange", data: { MailServiceMessage } });
    });
  } catch (error) {
    log({
      level: "error",
      event: "mail_id_processing_error",
      message: "Error in message consumer",
      data: { error: error.message, stack: error.stack }
    });
  }
};

// Continuous consumer function to listen for new message Responses
const startResponseConsumer = async () => {
  try {
    await responseMailFetch(async (responseMessage) => {
      log({ level: "info", event: "response_received", message: "Received response from exchange", data: { responseMessage } });
      Increment('mailService.responsePulled');

      const parsedMessage = JSON.parse(responseMessage);
      const result = await MailSender(parsedMessage);

      log({ level: "info", event: "mail_sent", message: "Mail sent successfully", data: { result } });
    });
  } catch (error) {
    log({
      level: "error",
      event: "response_processing_error",
      message: "Error in message sending",
      data: { error: error.message, stack: error.stack }
    });
  }
};

startMessageConsumer();
startResponseConsumer();

app.get('/callback', handleCallback);

app.listen(PORT, () => {
  console.log(`MailCronJob Server running at http://localhost:${PORT}`);
});


process.on("SIGINT", () => {
  console.log("MailService shutting down...");
  process.exit(0);
});