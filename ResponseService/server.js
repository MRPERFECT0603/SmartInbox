const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const connectdb = require("./Config/dbConfig");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 3003; 
connectdb();

const { queuePush } = require("./queues/queue"); 
const { messageFetch } = require("./services/MailResponse"); 
const { generateResponse  } = require("./Controllers/ResponseController");


const exchange = process.env.EXCHANGE; 
const routingKey = process.env.ROUTING_KEY_PUSH; 

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// Continuous consumer function to listen for new messages from the message queue
const startMessageConsumer = async () => {
  try {
    await messageFetch(async (message) => {
      console.log("Received new message from Exchange:", message);
      // console.log(message);
      const Message = JSON.parse(message);
      // console.log("Messsssssaggggggeee: "+ Message.sender + Message.id + Message.threadID + Message.messageData);
      const response = await generateResponse(Message.sender , Message.messageData);
      // console.log(response); 
      const queueMessage = {
        sender: Message.sender,
        Id: Message.id,
        threadID: Message.threadID,
        response: response
      };
      // console.log(queueMessage);
      const data = JSON.stringify(queueMessage);
      await queuePush({ exchange, routingKey,  message: data});
      console.log("Response Mail sent to the exchange:\n" + data);
    });
  } catch (error) {
    console.error("Error in message consumer:", error); 
  }
};


/**
 * Test function to demonstrate and validate the response generation process.
 *
 * This function provides a controlled environment to test the `generateResponse` 
 * function. It simulates a scenario where a user sends an email and logs the generated 
 * response for debugging purposes.
 *
 * @async
 * @function testfunction
 * @returns {Promise<void>} Logs the start and end of the test, along with the generated response.
========================>>>>>>>
const testfunction = async() => {
      console.log("TEST FUNCTYION START");
      const userName = "Nemo";
      const emailContent = "Good morning Sir, I want to meet you. Can you share your free time slot on Wednesday?";
      console.log("start the response function");
      const response = await generateResponse(userName , emailContent);
      console.log("stop the response function");
      console.log(response); 
      console.log("TEST FUNTION STOP");

}
testfunction();
=======================<<<<<<<<
*/

startMessageConsumer();





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});