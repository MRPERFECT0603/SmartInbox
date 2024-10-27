const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3002; 
// Important Imports 
const { messageIdFetch } = require("../MailPreprocessor/services/MessageFetch"); 
const { oAuth2Client, handleCallback } = require("./services/authService");
const { Mailpreprocessor } = require("./services/fetchMessageData");
const { queuePush } = require("./queues/queue");

const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH; 
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

startMessageConsumer();

// Route to handle OAuth2 callback
app.get('/callback', handleCallback);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});