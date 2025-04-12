const { queuePush } = require("../queues/queue");
const dotenv = require("dotenv");

dotenv.config();
/**
 * NewMailFetcher - Function to push new email data to the message queue
 * This function takes in email data and pushes it to a specified message queue using the exchange and routing key.
 * @param {object} data - The email data to be sent to the queue
 * @returns {Promise<void>} - This function returns a promise since queuePush is asynchronous
 */
const NewMailIdQueuePusher = async (data) => {

    const exchange = process.env.EXCHANGE;

    const routingKey = process.env.ROUTING_KEY;

    const message = JSON.stringify(data);

    await queuePush({ exchange, routingKey, message });

};


module.exports = { NewMailIdQueuePusher };