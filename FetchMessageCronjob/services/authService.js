// Import necessary modules
const { google } = require('googleapis'); 
const fs = require('fs'); 
const dotenv = require("dotenv"); 
const openURL = require("openurl"); 
const {queuePush} = require("../queues/queue");

dotenv.config();

// Extract values from environment variables
const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET; 
const redirect_uri = process.env.REDIRECT_URI; 
const SCOPES = process.env.SCOPES.split(','); 
const TOKEN_PATH = process.env.TOKEN_PATH; 

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

const exchage = process.env.EXCHANGE;
const routing = process.env.ROUTING_KEY;

/**
 * Handles the OAuth2 callback and processes the authorization code
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function handleCallback(req, res) {
    const code = req.query.code; 

    // Exchange the authorization code for an access token
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(500).send('Error retrieving access token.');
        }

        // Set the credentials and store the token for future use
        oAuth2Client.setCredentials(token);
        queuePush({exchange, routing, token });
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) {
                console.error('Error saving token', err);
                return res.status(500).send('Error saving token.');
            }
            console.log('Token stored to', TOKEN_PATH);
            res.send('Authentication successful! You can close this tab.');
        });
    });
}

/**
 * Generates a new OAuth2 token and prompts the user for authorization
 * @param {object} oAuth2Client - OAuth2 client object
 * @param {function} callback - Callback function to execute after the user authorizes
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'select_account',
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    openURL.open(authUrl); 
    // Once the user visits the URL and authorizes, they'll be redirected to your redirect_uri.
    // The authorization code will be captured in the callback function (see handleCallback).
}

/**
 * Authorizes the client using the existing token or initiates the token generation flow
 */
async function authorize() {
    return new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                return getNewToken(oAuth2Client, resolve);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            resolve(oAuth2Client); 
        });
    });
}

module.exports = { oAuth2Client, handleCallback, authorize };