const { authorize } = require("./Auth");
const { google } = require('googleapis');
const fs = require('fs');
const MESSAGE_PATH = 'message.txt';


// Call the users.messages.list method
async function listMessages(auth) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });
        const response = await gmail.users.messages.list({
            'userId': 'me', // or a specific user ID
            'labelIds': ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'], // optional, filter by label
        });
        console.log(response.data);
        fs.appendFile(MESSAGE_PATH, JSON.stringify(response.data), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', MESSAGE_PATH);
        });
    } catch (err) {
        console.error(err);
    }
}

authorize().then(auth => {
    console.log('Authorized successfully');
    listMessages(auth);
});