const { authorize } = require("./authService");
const { google } = require('googleapis');
const nodeBase64 = require('nodejs-base64-converter');
const { changeLabel } = require("./modifyLabel");
const { Increment } = require("../services/metricsServices");


/**
 * sendMail - Sends an email using the Gmail API
 * @param {string} encodedEmail - The base64url-encoded email string
 * @param {object} auth - The authorization object for Google API
 * @returns {Promise<object|null>} - Returns a promise that resolves with the send result or null if an error occurs
 */
const sendMail = async (encodedEmail, threadId, auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: encodedEmail,
                threadId: threadId,
            },
        });
        console.log(JSON.stringify({
            level: "info",
            service: "mail-service",
            event: "email_sent",
            message: "Email successfully sent via Gmail API",
            threadId,
            timestamp: new Date().toISOString()
        }));
        return response.data;
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "email_send_error",
            message: "Failed to send email via Gmail API",
            threadId,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
        return null;
    }
};

/**
 * Builds and encodes the full email content for Gmail
 * @param {object} responseMessage - The message object containing response and sender info
 * @returns {string} - Base64url-encoded email string
 */
const encodeMail = (sender, subject, body, signature, greeting) => {


    if (!sender || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(sender)) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "invalid_email_format",
            message: "Recipient email is invalid",
            email: sender,
            timestamp: new Date().toISOString()
        }));
        return null;
    }

    const emailContent =
        `To: ${sender}\n` +
        `Subject: ${subject}\n` +
        `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
        `${greeting}\n` +
        `${body}\n\n` +
        `${signature}`;

    const encodedMail = Buffer.from(emailContent, 'utf-8').toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return encodedMail;
};

const MailSender = async (ParsedMessage) => {
    try {
        const auth = await authorize(ParsedMessage.userEmail);
        if (auth) {
            console.log(JSON.stringify({
                level: "info",
                service: "mail-service",
                event: "gmail_authorized",
                message: "Successfully authorized Gmail access",
                userEmail: ParsedMessage.userEmail,
                timestamp: new Date().toISOString()
            }));
            const email = (ParsedMessage.response);
            const { subject: subject, body: body, signature: signature, greeting: greeting } = email;
            const sender = ParsedMessage.sender;
            const encodedEmail = encodeMail(sender, subject, body, signature, greeting);
            const message = await sendMail(encodedEmail, ParsedMessage.threadID, auth);
            if (message) {
                console.log(JSON.stringify({
                    level: "info",
                    service: "mail-service",
                    event: "mail_sent_success",
                    message: "Mail successfully sent and label changed",
                    messageId: message.id,
                    threadId: message.threadId,
                    timestamp: new Date().toISOString()
                }));
                Increment('mailService.responseSent');
                changeLabel(ParsedMessage.userEmail, ParsedMessage.Id);
            }
        } else {
            console.error(JSON.stringify({
                level: "error",
                service: "mail-service",
                event: "gmail_auth_failed",
                message: "Authorization for Gmail failed",
                userEmail: ParsedMessage.userEmail,
                timestamp: new Date().toISOString()
            }));
        }
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail-service",
            event: "mail_sender_error",
            message: "Error occurred in MailSender process",
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));
    }

    return null;
};

module.exports = { MailSender };