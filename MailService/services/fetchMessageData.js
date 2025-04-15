const { authorize } = require("./authService");
const { google } = require('googleapis');
const { preProcessMessage } = require("./preprocessor");
const { Increment } = require("../services/metricsServices");


/**
 * fetchMessageDetails - Fetches detailed information about a specific email message
 * @param {string} messageId - The ID of the message to fetch
 * @param {object} auth - The authorization object for Google API
 * @returns {Promise<object|null>} - Returns a promise that resolves with the message details or null if an error occurs
 */
const fetchMessageDetails = async (messageId, auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.get({
            'userId': 'me',
            'id': messageId,
        });
        return response.data;
    } catch (err) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "message_fetch_error",
            message: `Failed to fetch message details for messageId ${messageId}`,
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }));
        return null;
    }
};

/**
 * getSenderEmail - Extracts the sender's email address from the message headers
 * @param {Array<object>} headers - The headers of the email message
 * @returns {string|null} - Returns the sender's email address or null if not found
 */

const getSenderDetails = (headers) => {
    const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
    if (fromHeader) {
        const fromValue = fromHeader.value.trim();
        console.log(JSON.stringify({
            level: "info",
            service: "mail-service",
            event: "sender_parsed",
            message: "Parsed sender details successfully",
            sender: fromValue,
            timestamp: new Date().toISOString()
        }));

        if (fromValue.includes('<') && fromValue.includes('>')) {
            const namePart = fromValue.split('<')[0].trim().replace(/^"|"$/g, '');
            const emailPart = fromValue.split('<')[1].split('>')[0].trim();
            return { name: namePart, email: emailPart };
        } else {

            return { name: fromValue, email: fromValue };
        }
    }
    return { name: null, email: null };
};
/**
 * Mailpreprocessor - Processes an email message by fetching its details and pre-processing the data
 * @param {string} messageId - The ID of the message to process
 * @returns {Promise<object|null>} - Returns a promise that resolves with an object containing the sender's email and processed message data, or null if an error occurs
 */
const Mailpreprocessor = async (messageObject) => {
    try {
        const email = messageObject.email;
        const auth = await authorize(email);
        if (auth) {
            console.log(JSON.stringify({
                level: "info",
                service: "mail-service",
                event: "message_authorized",
                message: `Successfully authorized email: ${email}`,
                timestamp: new Date().toISOString()
            }));
            const message = await fetchMessageDetails(messageObject.id, auth);
            if (message) {
                Increment('mailService.mailsFetched');
                const { name: senderName, email: senderEmail } = getSenderDetails(message.payload.headers);
                console.log(JSON.stringify({
                    level: "info",
                    service: "mail-service",
                    event: "sender_extracted",
                    message: `Extracted sender: ${senderName} <${senderEmail}>`,
                    senderName,
                    senderEmail,
                    timestamp: new Date().toISOString()
                }));
                const messageData = preProcessMessage(message);
                console.log(JSON.stringify({
                    level: "info",
                    service: "mail-service",
                    event: "message_processed",
                    message: "Processed email message data successfully",
                    senderName,
                    senderEmail,
                    threadId: message.threadId,
                    messageId: message.id,
                    timestamp: new Date().toISOString()
                }));
                Increment('mailService.mailsPreprocessed');
                const threadID = message.threadId;
                const id = message.id;
                return { senderName, senderEmail, id, threadID, messageData };
            }
        } else {
            console.error(JSON.stringify({
                level: "error",
                service: "mail-service",
                event: "authorization_failed",
                message: `Failed to authorize email: ${email}`,
                timestamp: new Date().toISOString()
            }));
        }
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "message_processing_error",
            message: `Failed to process email message with ID ${messageObject.id}`,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
    }
    return null;
};

module.exports = { Mailpreprocessor };