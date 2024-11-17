const { queuePull } = require("../queues/queue");

/**
 * messageIdFetch - Initializes the message consumption process from the message queue
 * @param {function} onMessage - Callback function to be called when a new message ID is received
 */
const messageFetch = async (onMessage) => {
    const exchange = process.env.EXCHANGE; 
    const routingKey = process.env.ROUTING_KEY_PULL;

    queuePull({ exchange, routingKey }, (message) => {
        // console.log("PULLED Message", message); 
        if (onMessage) onMessage(message); 
    });
};

module.exports = { messageFetch };