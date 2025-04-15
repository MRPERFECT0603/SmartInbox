const { queuePull } = require("../queues/queue");

/**
 * messageIdFetch - Initializes the message consumption process from the message queue
 * @param {function} onMessage - Callback function to be called when a new message ID is received
 */
const messageIdFetch = async (onMessage) => {
    const exchange = process.env.EXCHANGE; 
    const routingKey = process.env.ROUTING_KEY_PULL_NEW_MAIL;

    queuePull({ exchange, routingKey }, (message) => {
        console.log(JSON.stringify({
            level: "info",
            service: "mail-service",
            event: "new_mail_id_received",
            message: "Message ID pulled from queue",
            exchange,
            routingKey,
            payload: message,
            timestamp: new Date().toISOString()
        }));

        if (onMessage) onMessage(message); 
    });
};

/**
 * messageIdFetch - Initializes the message consumption process from the message queue
 * @param {function} onMessage - Callback function to be called when a new message ID is received
 */
const responseMailFetch = async (onMessage) => {
    const exchange = process.env.EXCHANGE; 
    const routingKey = process.env.ROUTING_KEY_PULL_MAIL_RESPONE;

    queuePull({ exchange, routingKey }, (responseMessage) => {
        console.log(JSON.stringify({
            level: "info",
            service: "mail-service",
            event: "response_mail_id_received",
            message: "Response mail ID pulled from queue",
            exchange,
            routingKey,
            payload: responseMessage,
            timestamp: new Date().toISOString()
        }));

        if (onMessage) onMessage(responseMessage); 
    });
};

module.exports = { messageIdFetch  , responseMailFetch};