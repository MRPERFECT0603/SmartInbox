// Import the queuePush function from the queue module
const { queuePush } = require("../queues/queue");

/**
 * NewMailFetcher - Function to push new email data to the message queue
 * This function takes in email data and pushes it to a specified message queue using the exchange and routing key.
 * @param {object} data - The email data to be sent to the queue
 * @returns {Promise<void>} - This function returns a promise since queuePush is asynchronous
 */
const NewMailFetcher = async (data) => {

    // Define the message queue exchange (where messages are sent to be distributed)
    const exchange = 'MailzyExchange';

    // Define the routing key to ensure the message is delivered to the appropriate queue
    const routingKey = 'NewMessage';

    // Store the email data as the message to be sent to the queue
    const message = data;

    // Asynchronously push the email message to the queue using the exchange and routing key
    await queuePush({ exchange, routingKey, message });

};

/**
 * Export the NewMailFetcher function to make it available for other modules
 */
module.exports = { NewMailFetcher };