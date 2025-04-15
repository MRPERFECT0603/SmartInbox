const nodeBase64 = require('nodejs-base64-converter');

/**
 * preProcessMessage - Processes the email message to extract and decode its content
 * @param {object} message - The message object containing the payload to process
 * @returns {string|null} - Returns the cleaned and decoded message content or null if no valid data is found
 */
const preProcessMessage = (message) => {
    if (!message || !message.payload) {
        console.log(JSON.stringify({
            level: "warn",
            service: "mail-service",
            event: "missing_payload",
            message: "Message or payload is undefined",
            timestamp: new Date().toISOString()
        }));
        return null; 
    }

    let messageData;
    const mimeType = message.payload.mimeType; 

    console.log(JSON.stringify({
        level: "info",
        service: "mail-service",
        event: "mime_type_detected",
        mimeType,
        message: "Detected MIME type",
        timestamp: new Date().toISOString()
    }));

    // Determine how to extract message data based on MIME type
    if (mimeType === "multipart/alternative") {
        messageData = message.payload.parts[0]?.body?.data; 
    } else if (mimeType === "text/plain" || mimeType === "text/html") {
        messageData = message.body?.data; 
    } else if (mimeType === "multipart/mixed") {
        messageData = message.payload.parts[0]?.body?.data; 
    }
    if (messageData) {
        try {
            const decodedData = nodeBase64.decode(messageData);
            const cleanedContent = decodedData.split('\n')
                .map(line => line.trim())
                .filter(line => line !== '')
                .join('\n');

            console.log(JSON.stringify({
                level: "info",
                service: "mail-service",
                event: "message_decoded",
                message: "Message body successfully decoded and cleaned",
                timestamp: new Date().toISOString()
            }));

            return cleanedContent;
        } catch (error) {
            console.error(JSON.stringify({
                level: "error",
                service: "mail-service",
                event: "decode_error",
                message: "Error decoding message content",
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }));
            return null;
        }
    } else {
        console.log(JSON.stringify({
            level: "warn",
            service: "mail-service",
            event: "no_data_found",
            message: "No data found in message body",
            timestamp: new Date().toISOString()
        }));
        return null;
    }
};

module.exports = { preProcessMessage };