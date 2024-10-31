const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3003; 


const { queuePush } = require("./queues/queue"); 
const { messageFetch } = require("./services/MailResponse"); 
const { generateResponse  } = require("./Controllers/ResponseController");


const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH; 

const app = express();

app.use(express.json());

// Continuous consumer function to listen for new messages from the message queue
const startMessageConsumer = async () => {
  try {
    await messageFetch(async (message) => {
      console.log("Received new message from queue:", message);
      console.log(message);
      const Message = JSON.parse(message);
      console.log("Messsssssaggggggeee: "+ Message.sender + Message.id + Message.threadID + Message.messageData);
      const response = await generateResponse(Message.messageData , Message.sender);
      console.log(response.response); 
      const queueMessage = {
        sender: Message.sender,
        Id: Message.id,
        threadID: Message.threadID,
        response: response.response
      };
      console.log(queueMessage);
      const data = JSON.stringify(queueMessage);
      await queuePush({ exchange, routingKey,  message: data});
    });
  } catch (error) {
    console.error("Error in message consumer:", error); 
  }
};

startMessageConsumer();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});