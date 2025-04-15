const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const connectdb = require("./Config/dbConfig");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 8104;
connectdb();

const { queuePush } = require("./queues/queue");
const { messageFetch } = require("./services/MailResponse");
const { generateResponse, saveEmailHistory } = require("./Controllers/ResponseController");
const { Increment } = require("./services/metricsServices");

const exchange = process.env.EXCHANGE;
const routingKey = process.env.ROUTING_KEY_PUSH;

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// Log wrapper
const log = ({ level, event, message, data }) => {
  console.log(JSON.stringify({
    level,
    service: "response-service",
    event,
    message,
    data,
    timestamp: new Date().toISOString()
  }));
};

// Continuous consumer function to listen for new messages from the message queue
const startMessageConsumer = async () => {
  try {
    await messageFetch(async (message) => {
      Increment('responseService.mailsPulled');
      log({ level: "info", event: "message_received", message: "Received new message from exchange", data: { message } });

      const Message = JSON.parse(message);

      const response = await generateResponse(
        Message.userEmail,
        Message.senderName,
        Message.senderEmail,
        Message.messageData
      );
      Increment('responseService.responseGenerated');
      log({ level: "info", event: "response_generated", message: "Generated response", data: { response } });

      const queueMessage = {
        userEmail: Message.userEmail,
        sender: Message.senderEmail,
        Id: Message.id,
        threadID: Message.threadID,
        response: response
      };

      const EmailHistory = {
        userEmail: Message.userEmail,
        sender: Message.senderName,
        messageData: Message.messageData,
        response: response
      };

      saveEmailHistory(EmailHistory);

      const data = JSON.stringify(queueMessage);
      await queuePush({ exchange, routingKey, message: data });

      Increment('responseService.responsePushed');
      log({ level: "info", event: "response_pushed", message: "Response mail sent to exchange", data: { queueMessage } });
    });
  } catch (error) {
    log({
      level: "error",
      event: "response_processing_error",
      message: "Error while processing message for response",
      data: { error: error.message, stack: error.stack }
    });
  }
};

startMessageConsumer();

app.listen(PORT, () => {
  console.log(`ResponseService running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("ResponseService shutting down...");
  process.exit(0);
});