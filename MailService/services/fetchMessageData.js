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
        console.error("Error fetching message details:", err);
        return null; 
    }
};

/**
 * getSenderEmail - Extracts the sender's email address from the message headers
 * @param {Array<object>} headers - The headers of the email message
 * @returns {string|null} - Returns the sender's email address or null if not found
 */
const getSenderEmail = (headers) => {
    const fromHeader = headers.find(header => header.name.toLowerCase() === 'from');
    if (fromHeader) {
        const emailMatch = fromHeader.value.match(/<([^>]+)>/);
        return emailMatch ? emailMatch[1] : fromHeader.value; 
    }
    return null;
};

/**
 * Mailpreprocessor - Processes an email message by fetching its details and pre-processing the data
 * @param {string} messageId - The ID of the message to process
 * @returns {Promise<object|null>} - Returns a promise that resolves with an object containing the sender's email and processed message data, or null if an error occurs
 */
const Mailpreprocessor = async (messageId) => {
    try {
        console.log("Processing message ID:", messageId);
        const auth = await authorize(); 
        if (auth) {
            console.log('Authorized successfully');
            const message = await fetchMessageDetails(messageId.id, auth); 
            if (message) {
                Increment('mailService.mailsFetched');
                const sender = getSenderEmail(message.payload.headers); 
                const messageData = preProcessMessage(message); 
                Increment('mailService.mailsPreprocessed');
                const threadID = message.threadId;
                const id = message.id;
                return { sender, id ,threadID , messageData }; 
            }
        } else {
            console.error("Authorization failed.");
        }
    } catch (error) {
        console.error("Error in Mailpreprocessor:", error);
    }
    return null; 
};

module.exports = { Mailpreprocessor };