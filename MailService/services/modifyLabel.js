const { authorize } = require("./authService");
const { google } = require('googleapis');

/**
 * Modifies the labels of a specific Gmail message.
 *
 * This function uses the Gmail API to update the labels of a message by removing or adding 
 * specified labels. In this implementation, it removes the `UNREAD` label from the message 
 * to mark it as read.
 *
 * @async
 * @function changeMailLabel
 * @param {string} messageID - The unique ID of the Gmail message to modify.
 * @param {Object} auth - The OAuth2 client or authentication object used to access the Gmail API.
 * @returns {Promise<Object|null>} Resolves with the response data from the Gmail API if successful, 
 * or `null` if an error occurs.
 */
const changeMailLabel = async (messageID, auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.modify({
            userId: "me",
            id: messageID,
            resource: {
                removeLabelIds: ["UNREAD"]// Array of label IDs to remove
            }
        });
        // console.log(" CHanged successfully:", response.data);
        return response.data; 
    } catch (err) {
        console.error("Error sending email:", err);
        return null; 
    }
};
    
/**
 * Changes the label of a Gmail message by authorizing and modifying the label.
 *
 * This function processes a Gmail message by first authorizing the user, and then using 
 * the `changeMailLabel` function to remove the `UNREAD` label from the specified message. 
 * It logs success and error messages throughout the process.
 *
 * @async
 * @function changeLabel
 * @param {string} messageID - The unique ID of the Gmail message to modify.
 * @returns {Promise<null>} Always returns `null` after processing.
 */
const changeLabel = async (messageID) => {
    try {
        console.log("Processing Response Message to change label:", messageID);
        const auth = await authorize(); 
        if (auth) {
            console.log('Authorized successfully');
            const message = await changeMailLabel(messageID, auth); 
            if (message) {
                console.log("Changed SUCCESSFULLY:", message);
            }
        } else {
            console.error("Authorization failed.");
        }
    } catch (error) {
        console.error("Error in Label Modification:", error);
    }
    return null; 
}

module.exports = { changeLabel };