// Import the amqplib module for interacting with AMQP (Advanced Message Queuing Protocol) message brokers
const amqp = require('amqplib');

/**
 * queueConnection - Function to establish a connection to the message queue
 * This function connects to the RabbitMQ server, creates a channel, and sets up an exchange and queue.
 * @param {object} params - Parameters for setting up the exchange and queue
 * @param {string} params.exchange - The name of the exchange to use for publishing messages
 * @param {string} params.routingKey - The routing key for binding the queue to the exchange
 * @returns {Promise<object>} - Returns a promise that resolves with an object containing the connection and channel
 */
const queueConnection = async ({ exchange, routingKey }) => {
    // Establish a connection to the RabbitMQ server running on localhost
    const connection = await amqp.connect('amqp://localhost');

    // Create a new channel for communication with the message queue
    const channel = await connection.createChannel();

    // Assert the existence of an exchange (create it if it doesn't exist) with durability set to true
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Assert the existence of a queue with the specified routing key (create it if it doesn't exist)
    const queue = await channel.assertQueue(routingKey, { exclusive: false });

    // Bind the queue to the exchange using the provided routing key
    await channel.bindQueue(queue.queue, exchange, routingKey);

    // Return an object containing the connection and channel for further use
    return { connection, channel };
};

/**
 * queuePush - Function to send a message to the specified queue via the exchange
 * This function publishes a message to the given exchange using the specified routing key.
 * @param {object} params - Parameters for sending the message
 * @param {string} params.exchange - The name of the exchange to publish the message to
 * @param {string} params.routingKey - The routing key for the message
 * @param {string} params.message - The message content to be sent
 * @returns {Promise<void>} - This function returns a promise since it involves asynchronous operations
 */
const queuePush = async ({ exchange, routingKey, message }) => {
    // Establish a connection to the queue and retrieve the connection and channel objects
    const { connection, channel } = await queueConnection({ exchange, routingKey });

    // Publish the message to the exchange with the specified routing key, converting the message to a Buffer
    channel.publish(exchange, routingKey, Buffer.from(message));

    // Log a message to the console indicating that the message has been sent
    console.log(` [x] Sent '${message}'`);

    // Close the connection after a short delay (500ms) to ensure the message is processed
    setTimeout(() => {
        connection.close(); // Close the connection to the RabbitMQ server
    }, 500);
};

// Export the queuePush function to make it available for use in other parts of the application
module.exports = { queuePush };