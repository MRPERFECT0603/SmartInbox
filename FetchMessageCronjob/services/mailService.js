// Import necessary modules
const { google } = require('googleapis'); // Google API client library for accessing Gmail API
const fs = require('fs'); // File system module for reading/writing files
const MESSAGE_PATH = 'message.txt'; // Path to store or retrieve message-related data (optional usage)

/**
 * listMessages - Function to list Gmail messages from a user's inbox
 * This function retrieves messages from the Gmail API, optionally filtering by label.
 * @param {object} auth - OAuth2 client object for authentication
 * @returns {object} response.data - The list of Gmail messages retrieved from the user's inbox
 */
async function listMessages(auth) {
    try {
        // Initialize the Gmail API with the authenticated client and version
        const gmail = google.gmail({ version: 'v1', auth });
        
        // Call the Gmail API to list messages with specific label filters (INBOX, UNREAD, CATEGORY_PERSONAL)
        const response = await gmail.users.messages.list({
            'userId': 'me', // 'me' refers to the authenticated user, or use a specific user ID
            'labelIds': ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'], // Optional, filter messages by labels
        });

        // Log the response data to the console for review
        console.log(response.data);

        // Return the list of messages data for further processing or use
        return response.data;
    } catch (err) {
        // If an error occurs during the API call, log the error details
        console.error(err);
    }
}

// Export the listMessages function for use in other parts of the application
module.exports = { listMessages };