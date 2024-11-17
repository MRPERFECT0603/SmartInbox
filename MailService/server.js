const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./Config/dbConfig");

dotenv.config();
connectdb();

// Important Imports 
const { messageIdFetch, responseMailFetch } = require("./services/MessageFetch"); 
const { handleCallback } = require("./services/authService");
const { Mailpreprocessor } = require("./services/fetchMessageData");
const { queuePush } = require("./queues/queue");
const { MailSender } = require("./services/MailSender");

const PORT = process.env.PORT || 3002; 
const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH_NEW_MAIL; 
const app = express();

app.use(express.json());

// Continuous consumer function to listen for new message IDs
const startMessageConsumer = async () => {
  try {
    await messageIdFetch(async (messageId) => {
      console.log("Recieved New MailId from the Exchange:-", messageId);
      const messageObject = JSON.parse(messageId);
      const result = await Mailpreprocessor(messageObject); 
      const message = result; 
      await queuePush({ exchange, routingKey, message });
      console.log("Message Pushed to the Exchange:-"+ message.sender + " "+ message.id + " "+ message.threadID +" "+ message.messageData );
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
      const parsedMessage = JSON.parse(JSON.parse(responseMessage));
      const result = await MailSender(parsedMessage); 
      const message = result; 
      // console.log(message); 
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