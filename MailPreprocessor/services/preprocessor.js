const nodeBase64 = require('nodejs-base64-converter');

/**
 * preProcessMessage - Processes the email message to extract and decode its content
 * @param {object} message - The message object containing the payload to process
 * @returns {string|null} - Returns the cleaned and decoded message content or null if no valid data is found
 */
const preProcessMessage = (message) => {
    if (!message || !message.payload) {
        console.warn("Message or payload is undefined.");
        return null; 
    }

    let messageData;
    const mimeType = message.payload.mimeType; 

    // Determine how to extract message data based on MIME type
    if (mimeType === "multipart/alternative") {
        messageData = message.payload.parts[0]?.body?.data; 
    } else if (mimeType === "text/plain" || mimeType === "text/html") {
        messageData = message.body?.data; 
    } else if (mimeType === "multipart/mixed") {
        messageData = message.payload.parts[0]?.body?.data; 
    }

    if (messageData) {
        const decodedData = nodeBase64.decode(messageData); // Decode the base64 encoded data

        // Clean the decoded content
        const cleanedContent = decodedData.split('\n')
            .map(line => line.trim())     
            .filter(line => line !== '')   
            .join('\n');                  
        return cleanedContent;
    } else {
        console.warn("No data found in message body.");
        return null; 
    }
};

module.exports = { preProcessMessage };