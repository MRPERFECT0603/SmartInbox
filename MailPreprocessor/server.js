const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3002; 
// Important Imports 
const { messageIdFetch, responseMailFetch } = require("../MailPreprocessor/services/MessageFetch"); 
const { oAuth2Client, handleCallback } = require("./services/authService");
const { Mailpreprocessor } = require("./services/fetchMessageData");
const { queuePush } = require("./queues/queue");
const { MailSender } = require("./services/MailSender");

const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH_NEW_MAIL; 
const app = express();

app.use(express.json());

// Continuous consumer function to listen for new message IDs
const startMessageConsumer = async () => {
  try {
    await messageIdFetch(async (messageId) => {
      console.log("Received new message ID from queue:", messageId);
      const result = await Mailpreprocessor(messageId); 
      const message = result; 
      //console.log(message); 
      await queuePush({ exchange, routingKey, message });
    });
  } catch (error) {
    console.error("Error in message consumer:", error); 
  }
};

// Continuous consumer function to listen for new message Responses
const startResponseConsumer = async () => {
  try {
    await responseMailFetch(async (responseMessage) => {
      console.log("Received new  Response message from queue:", responseMessage);
      const result = await MailSender(responseMessage); 
      const message = result; 
      console.log(message); 
    });
  } catch (error) {
    console.error("Error in message Sending:", error); 
  }
};

startMessageConsumer();
startResponseConsumer();

// Route to handle OAuth2 callback
app.get('/callback', handleCallback);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});