const amqp = require('amqplib');

/**
 * queueConnection - Establishes a connection to RabbitMQ and sets up exchange and queue.
 *
 * @param {object} params - Parameters for setting up the exchange and queue
 * @param {string} params.exchange - The name of the exchange to use
 * @param {string} params.routingKey - The routing key for binding the queue
 * @returns {Promise<object>} - Returns an object containing the connection and channel
 */
const queueConnection = async ({ exchange, routingKey }) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });
        const queue = await channel.assertQueue(routingKey, { exclusive: false });
        await channel.bindQueue(queue.queue, exchange, routingKey);

        console.log(JSON.stringify({
            level: "info",
            service: "queue-service_mailservice",
            event: "queue_connection_success",
            message: "Connected to RabbitMQ and initialized exchange and queue",
            exchange,
            routingKey,
            timestamp: new Date().toISOString()
        }));

        return { connection, channel , queue};
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "queue-service_mailservice",
            event: "queue_connection_failure",
            message: "Failed to connect to RabbitMQ or initialize exchange/queue",
            exchange,
            routingKey,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
        throw error;
    }
};

/**
 * queuePush - Publishes a message to the specified RabbitMQ queue through an exchange.
 *
 * @param {object} params - Parameters for sending the message
 * @param {string} params.exchange - The name of the exchange to publish to
 * @param {string} params.routingKey - The routing key for the message
 * @param {string} params.message - The message content to send
 * @returns {Promise<void>} - Returns a promise for async message publishing
 */
const queuePush = async ({ exchange, routingKey, message }) => {
    try {
        const { connection, channel ,queue} = await queueConnection({ exchange, routingKey });
        channel.publish(exchange, routingKey, Buffer.from(message));

        console.log(JSON.stringify({
            level: "info",
            service: "queue-service_mailservice",
            event: "message_published",
            message: "Message published from mailcronjob_service to RabbitMQ queue",
            exchange,
            routingKey,
            payload: message,
            timestamp: new Date().toISOString()
        }));

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "queue-service_mailservice",
            event: "message_publish_error",
            message: "Failed to publish message from mailcronjob_service to queue",
            exchange,
            routingKey,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
    }
};

/**
 * queuePull -  Pull a message from the specified RabbitMQ queue through an exchange.
 *
 * @param {object} params - Parameters for sending the message
 * @param {string} params.exchange - The name of the exchange to publish the message to
 * @param {string} params.routingKey - The routing key for the message
 * @returns {Promise<void>} - This function returns a promise since it involves asynchronous operations
 */
const queuePull = async ({ exchange, routingKey }, onMessage) => {
    try {
        const { connection, channel, queue } = await queueConnection({ exchange, routingKey });

        channel.consume(queue.queue, (msg) => {
            const message = msg.content.toString();
            channel.ack(msg);
            if (onMessage) onMessage(message);
        }, { noAck: false });

        console.log(JSON.stringify({
            level: "info",
            service: "queue-service_mailservice",
            event: "message_consumed",
            message: "Message successfully consumed from RabbitMQ queue",
            exchange,
            routingKey,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {

        console.error(JSON.stringify({
            level: "error",
            service: "queue-service_mailservice",
            event: "message_consume_error",
            message: "Failed to consume message from RabbitMQ queue",
            exchange,
            routingKey,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
    }
};

module.exports = { queuePush , queuePull };