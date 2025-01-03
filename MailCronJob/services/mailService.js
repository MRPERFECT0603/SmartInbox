const { google } = require('googleapis'); 

/**
 * listMessages - Function to list Gmail messages from a user's inbox
 * This function retrieves messages from the Gmail API, optionally filtering by label.
 * @param {object} auth - OAuth2 client object for authentication
 * @returns {object} response.data - The list of Gmail messages retrieved from the user's inbox
 */
async function listMessages(auth) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        
        const response = await gmail.users.messages.list({
            'userId': 'me', 
            'labelIds': ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'], 
        });

        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { listMessages };