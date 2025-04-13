const { authorize } = require("./authService");
const { google } = require('googleapis');
const nodeBase64 = require('nodejs-base64-converter');
const {changeLabel} = require("./modifyLabel");
const { Increment } = require("../services/metricsServices");


/**
 * sendMail - Sends an email using the Gmail API
 * @param {string} encodedEmail - The base64url-encoded email string
 * @param {object} auth - The authorization object for Google API
 * @returns {Promise<object|null>} - Returns a promise that resolves with the send result or null if an error occurs
 */
const sendMail = async (encodedEmail, threadId ,auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: encodedEmail,
                threadId: threadId,
            },
        });
        return response.data; 
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

/**
 * Builds and encodes the full email content for Gmail
 * @param {object} responseMessage - The message object containing response and sender info
 * @returns {string} - Base64url-encoded email string
 */
const encodeMail = (sender, subject , body ,signature, greeting) => {
    // console.log("Vivek" +sender , subject , body ,signature, greeting );

    if (!sender || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(sender)) {
        console.error("Invalid recipient email address.");
        return null;
    }

    const emailContent = 
        `To: ${sender}\n` +
        `Subject: ${subject}\n` +
        `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
        `${greeting}\n`+
        `${body}\n\n`+
        `${signature}`;

    // Encode email in base64url format for Gmail API compatibility
    const encodedMail = Buffer.from(emailContent, 'utf-8').toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return encodedMail;
};

const MailSender = async (ParsedMessage) => {
    try {
        console.log("Processing Response Message:", ParsedMessage);
        const auth = await authorize(ParsedMessage.userEmail); 
        if (auth) {
            console.log('Authorized successfully');
            const email = (ParsedMessage.response);
            const { subject: subject, body: body , signature: signature , greeting: greeting} = email;
            const sender  = ParsedMessage.sender;
            const encodedEmail = encodeMail(sender, subject , body ,signature, greeting); 
            const message = await sendMail(encodedEmail, ParsedMessage.threadID ,auth); 
            if (message) {
                console.log("SENT SUCCESSFULLY:", message);
                Increment('mailService.responseSent');
                changeLabel(ParsedMessage.userEmail , ParsedMessage.Id);
            }
        } else {
            console.error("Authorization failed.");
        }
    } catch (error) {
        console.error("Error in MailSender:", error);
    }
    return null; 
}

module.exports = { MailSender };