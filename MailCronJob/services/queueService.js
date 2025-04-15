const { queuePush } = require("../queues/queue");
const dotenv = require("dotenv");

dotenv.config();

/**
 * NewMailIdQueuePusher - Pushes new mail ID data to the message queue.
 * This function serializes the input data and sends it to a message queue
 * using the configured exchange and routing key.
 *
 * @param {object} data - The email data (mailId or metadata) to be sent to the queue
 * @returns {Promise<void>} - A promise that resolves when the message is pushed
 */
const NewMailIdQueuePusher = async (data) => {
    const exchange = process.env.EXCHANGE;
    const routingKey = process.env.ROUTING_KEY;
    const message = JSON.stringify(data);

    try {
        await queuePush({ exchange, routingKey, message });

        console.log(JSON.stringify({
            level: 'info',
            service: 'queue-pusher_mailcronjob',
            event: 'new_mail_id_pushed',
            exchange,
            routingKey,
            messagePreview: message.slice(0, 50), 
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.error(JSON.stringify({
            level: 'error',
            service: 'queue-pusher_mailcronjob',
            event: 'push_failed',
            exchange,
            routingKey,
            error: error.message,
            timestamp: new Date().toISOString()
        }));
    }
};

module.exports = { NewMailIdQueuePusher };