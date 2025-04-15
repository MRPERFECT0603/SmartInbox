const { authorize } = require("./authService");
const { google } = require('googleapis');
const { Increment } = require("../services/metricsServices");


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
                removeLabelIds: ["UNREAD"]
            }
        });
        console.log(JSON.stringify({
            level: "info",
            service: "mail-service",
            event: "label_changed",
            message: "Label changed successfully",
            messageID,
            timestamp: new Date().toISOString()
        }));
        return response.data; 
    } catch (err) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "label_change_failed",
            messageID,
            message: "Error modifying Gmail label",
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }));
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
const changeLabel = async (email, messageID) => {
    try {
        console.log("Processing Response Message to change label:", messageID);
        const auth = await authorize(email); 
        if (auth) {
            console.log(JSON.stringify({
                level: "info",
                service: "mail-service",
                event: "auth_success",
                email,
                message: "Authorization successful",
                timestamp: new Date().toISOString()
            }));
            const message = await changeMailLabel(messageID, auth); 
            if (message) {
                console.log("Changed SUCCESSFULLY:", message);
                Increment('mailService.labelsChanged');
            }
        } else {
            console.error(JSON.stringify({
                level: "error",
                service: "mail-service",
                event: "auth_failed",
                email,
                message: "Authorization failed",
                timestamp: new Date().toISOString()
            }));
        }
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "label_change_error",
            email,
            messageID,
            message: "Unhandled error during label modification",
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
    }
    return null; 
}

module.exports = { changeLabel };