const { google } = require('googleapis'); 

/**
 * listMessages - Function to list Gmail messages from a user's inbox
 * This function retrieves messages from the Gmail API, optionally filtering by label.
 * @param {object} auth - OAuth2 client object for authentication
 * @returns {object} response.data - The list of Gmail messages retrieved from the user's inbox
 */
async function listNewMailIds(auth) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        
        const response = await gmail.users.messages.list({
            'userId': 'me', 
            'labelIds': ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'], 
        });

        console.log(JSON.stringify({
            level: 'info',
            service: 'gmail-service',
            event: 'list_messages_success',
            message: 'Successfully fetched unread personal emails',
            messageCount: response.data.length,
            timestamp: new Date().toISOString()
        }));

        return response.data;
    } catch (err) {
        console.error(JSON.stringify({
            level: 'error',
            service: 'gmail-service',
            event: 'list_messages_failure',
            message: 'Failed to list Gmail messages',
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }));
    }
}

module.exports = { listNewMailIds };