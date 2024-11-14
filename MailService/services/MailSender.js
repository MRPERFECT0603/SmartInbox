const { authorize } = require("./authService");
const { google } = require('googleapis');
const nodeBase64 = require('nodejs-base64-converter');
const {changeLabel} = require("./modifyLabel");

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
        console.log("Email sent successfully:", response.data);
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
const encodeMail = (sender, subject , body ,signature) => {
    // Validate the recipient's email format
    console.log("EMAIL SENDER NAME:"+sender);
    if (!sender || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(sender)) {
        console.error("Invalid recipient email address.");
        return null;
    }

    // Construct the email content
    const emailContent = 
        `To: ${sender}\n` +
        `Subject: ${subject}\n` +
        `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
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
        const auth = await authorize(); 
        if (auth) {
            console.log('Authorized successfully');
            console.log(typeof(ParsedMessage));
            console.log(ParsedMessage.sender);
            console.log(ParsedMessage.response);
            const email = (ParsedMessage.response);
            const { subject: subject, body: body , signature: signature , greating: greating} = email;
            const sender  = ParsedMessage.sender;
            console.log("Subject:", subject);
            console.log("Greating:", greating);
            console.log("Body:", body);
            console.log("Signature:", signature);
            console.log(ParsedMessage.Id);
            const encodedEmail = encodeMail(sender, subject , body ,signature); // Pass the full message
            const message = await sendMail(encodedEmail, ParsedMessage.threadID ,auth); 
            if (message) {
                console.log("SENT SUCCESSFULLY:", message);
                changeLabel(ParsedMessage.Id);
                console.log("LABEL CHANGED SUCCESSFULLY!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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