// Import necessary modules
const { google } = require('googleapis'); // Google API client library
const fs = require('fs'); // File system module for reading/writing files
const dotenv = require("dotenv"); // dotenv module to load environment variables
const openURL = require("openurl"); // For automatically opening the authorization URL

// Load environment variables from .env file
dotenv.config();

// Extract values from environment variables
const client_id = process.env.CLIENT_ID; // Google API client ID
const client_secret = process.env.CLIENT_SECRET; // Google API client secret
const redirect_uri = process.env.REDIRECT_URI; // Redirect URI for OAuth2 callback
const SCOPES = process.env.SCOPES.split(','); // Scopes define the API access level (split if it's a comma-separated string)
const TOKEN_PATH = process.env.TOKEN_PATH; // File path to store the token

// Create a new OAuth2 client instance
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

/**
 * Handles the OAuth2 callback and processes the authorization code
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function handleCallback(req, res) {
    const code = req.query.code; // Get the authorization code from the URL query

    // Exchange the authorization code for an access token
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(500).send('Error retrieving access token.');
        }

        // Set the credentials and store the token for future use
        oAuth2Client.setCredentials(token);
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
    openURL.open(authUrl); // Automatically open the URL in the user's default browser

    // Once the user visits the URL and authorizes, they'll be redirected to your redirect_uri.
    // The authorization code will be captured in the callback function (see handleCallback).
}

/**
 * Authorizes the client using the existing token or initiates the token generation flow
 */
async function authorize() {
    return new Promise((resolve, reject) => {
        // Check if the token already exists
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                // If token does not exist, start the token generation flow
                return getNewToken(oAuth2Client, resolve);
            }

            // Use the existing token
            oAuth2Client.setCredentials(JSON.parse(token));
            resolve(oAuth2Client); // Resolve with the OAuth2 client
        });
    });
}

// Export the OAuth2 client and the handleCallback function
module.exports = { oAuth2Client, handleCallback, authorize };