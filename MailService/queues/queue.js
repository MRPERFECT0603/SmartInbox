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
    const connection = await amqp.connect('amqp://admin:admin123@10.102.248.217:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'direct', { durable: true });
    const queue = await channel.assertQueue(routingKey, { exclusive: false });
    await channel.bindQueue(queue.queue, exchange, routingKey);
    return { connection, channel  , queue};
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
    const { connection, channel , queue } = await queueConnection({ exchange, routingKey });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    // console.log(` [x] Sent '${message}'`);
    setTimeout(() => {
        connection.close(); // Close the connection to the RabbitMQ server
    }, 500);
};
/**
 * queuePull - Function to send a message to the specified queue via the exchange
 * This function consumes a message to the given exchange using the specified routing key.
 * @param {object} params - Parameters for sending the message
 * @param {string} params.exchange - The name of the exchange to publish the message to
 * @param {string} params.routingKey - The routing key for the message
 * @returns {Promise<void>} - This function returns a promise since it involves asynchronous operations
 */
const queuePull = async ({ exchange, routingKey } , onMessage) => {
    const { connection, channel, queue } = await queueConnection({ exchange, routingKey });
    channel.consume(queue.queue , (msg) => {
        const messageId = msg.content.toString();
        // console.log(` [x] Received messageId: ${messageId}`);
        channel.ack(msg);
        if (onMessage) onMessage(messageId);
    }, { noAck: false });
};



module.exports = { queuePush , queuePull };