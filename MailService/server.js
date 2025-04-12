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

// Continuous consumer function to listen for new Mail IDs
const startMessageConsumer = async () => {
  try {
    await messageIdFetch(async (message) => {
      console.log("Recieved New MailId from the Exchange:-", message);
      Increment('mailService.mailIdPulled');
      const messageObject = JSON.parse(message);
      // console.log(messageObject);
      let result = await Mailpreprocessor(messageObject); 
      // console.log("Shaurya"+ JSON.stringify(result));
      result = {
        ...result,
        userEmail: messageObject.email,
      }
      const MailServiceMessage = JSON.stringify(result);
      await queuePush({ exchange, routingKey, MailServiceMessage });
      Increment('mailService.mailsPushed');
      console.log("Message Pushed to the Exchange:-"+ MailServiceMessage);
    });
  } catch (error) {
    console.error("Error in message consumer:", error); 
  }
};

// Continuous consumer function to listen for new message Responses
const startResponseConsumer = async () => {
  try {
    await responseMailFetch(async (responseMessage) => {
      console.log("Received new Response message from Exchange:", responseMessage);
      Increment('mailService.responsePulled');
      const parsedMessage = JSON.parse(JSON.parse(responseMessage));
      const result = await MailSender(parsedMessage); 
      const message = result; 
    });
  } catch (error) {
    console.error("Error in message Sending:", error); 
  }
};

startMessageConsumer();
startResponseConsumer();

app.get('/callback', handleCallback);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});