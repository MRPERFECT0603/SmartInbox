const { authorize } = require("./authService");
const { google } = require('googleapis');

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
        console.log(" CHanged successfully:", response.data);
        return response.data; 
    } catch (err) {
        console.error("Error sending email:", err);
        return null; 
    }
};
    

const changeLabel = async (messageID) => {
    try {
        console.log("Processing Response Message:", messageID);
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
        console.error("Error in Mailpreprocessor:", error);
    }
    return null; 
}

module.exports = { changeLabel };