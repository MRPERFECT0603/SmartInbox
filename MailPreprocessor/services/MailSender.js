const { authorize } = require("../services/authService");
const { google } = require('googleapis');
const nodeBase64 = require('nodejs-base64-converter');

/**
 * sendMail - Sends an email using the Gmail API
 * @param {string} encodedEmail - The base64url-encoded email string
 * @param {object} auth - The authorization object for Google API
 * @returns {Promise<object|null>} - Returns a promise that resolves with the send result or null if an error occurs
 */
const sendMail = async (encodedEmail, auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: encodedEmail,
            },
        });
        console.log("Email sent successfully:", response.data);
        return response.data; 
    } catch (err) {
        console.error("Error sending email:", err);
        return null; 
    }
};

const encodeMail = (responseMessage) => {
    const encodedMail = nodeBase64.encode(responseMessage);
    return encodedMail;
}

const MailSender = async (responseMessage) => {
    try {
        console.log("Processing Response Message:", responseMessage);
        const auth = await authorize(); 
        if (auth) {
            console.log('Authorized successfully');
            const encodedEmail = encodeMail(responseMessage);
            const message = await sendMail(encodedEmail, auth); 
            if (message) {
                console.log(message);
                console.log("SENT SUCCESSFULLY");
            }
        } else {
            console.error("Authorization failed.");
        }
    } catch (error) {
        console.error("Error in Mailpreprocessor:", error);
    }
    return null; 
}
module.exports = { MailSender };