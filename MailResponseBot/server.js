const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3003; 
const { queuePush } = require("./queues/queue");
const { messageFetch } = require("./services/MailResponse");
const { generateResponse } = require("./Controllers/ResponseController");

const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH; 
const app = express();

app.use(express.json());

// Continuous consumer function to listen for new messages
const startMessageConsumer = async () => {
  try {
    await messageFetch(async (message) => {
      console.log("Received new message ID from queue:", message);
      const Message = JSON.parse(message);
      const response = await generateResponse(Message.MessageData);
      console.log(response);
    //   await queuePush({ exchange, routingKey, message });
    });
  } catch (error) {
    console.error("Error in message consumer:", error); 
  }
};

startMessageConsumer();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});