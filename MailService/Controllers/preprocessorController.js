
const { authorize } = require("../Config/Auth");
const { google } = require('googleapis');
const nodeBase64 = require('nodejs-base64-converter');

const fetchMessageDetails = async (messageId, auth) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.get({
            'userId': 'me',
            'id': messageId,
        });
        // console.log(response.data);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}
const preProcessMessage = (message) => {
    //Print the JsonObject
    // console.log(message);
    let messageData;
    if (message.payload.mimeType === "multipart/alternative") {
        messageData = message.payload.parts[0].body.data;
        // Print the Data Message Data encoded
        // console.log(message.payload.parts[0].body.data);
    }
    if (message.payload.mimeType === "text/plain") {
        messageData = message.body.data;
        console.log(message.body.data);
    }
    if (message.payload.mimeType === "text/html") {
        messageData = message.body.data;
        console.log(message.body.data);
    }
    if (message.payload.mimeType === "multipart/mixed") {
        messageData = message.payload.parts[0].body.data;
        console.log(message.payload.parts[0].body.data);
    }
    //Print the decoded mail
    console.log(nodeBase64.decode(messageData));
    const decodedData = nodeBase64.decode(messageData);
    return decodedData;
}

const preprocessor = (req, res) => {
    const messageId = req.query.messageId;
    // res.status(200).json(messageId);
    authorize().then(
        auth => {
            console.log('Authorized successfully');
            fetchMessageDetails(messageId, auth).then(message => {
                const messageData = preProcessMessage(message);
                res.status(200).json(messageData);
            });

        }
    )
}

module.exports = { preprocessor }