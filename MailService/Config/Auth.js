const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const client_id = '12217672920-ab5bcdk8j2lf1vpt5346na765skmvb09.apps.googleusercontent.com';
const client_secret = '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';
const redirect_uri = 'http://localhost:8000';
const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = 'token.json';
const AUTH_PATH = 'auth.json';




// Function to authorize with OAuth2
async function authorize() {
    const credentials = {
        client_id,
        client_secret,
        redirect_uris: [redirect_uri],
    };

    // Function to get a new token if needed
    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this URL:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    // Function to handle authorization process
    function authorizeWithCallback(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    return new Promise((resolve, reject) => {
        authorizeWithCallback(credentials, (oAuth2Client) => {
            resolve(oAuth2Client);

        });
    });
}



// authorize().then((auth) => {
//     console.log("Authorized!!");
//     fs.writeFile(AUTH_PATH, JSON.stringify(auth), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', AUTH_PATH);
//     });
// });

module.exports = { authorize }; 