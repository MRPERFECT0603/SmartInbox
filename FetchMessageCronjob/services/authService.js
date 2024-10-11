// Import necessary modules
const { google } = require('googleapis'); // Google API client library
const fs = require('fs'); // File system module for reading/writing files
const readline = require('readline'); // Readline module for handling user input via terminal
const dotenv = require("dotenv"); // dotenv module to load environment variables

// Load environment variables from .env file
dotenv.config();

// Extract values from environment variables
const client_id = process.env.CLIENT_ID; // Google API client ID
const client_secret = process.env.CLIENT_SECRET; // Google API client secret
const redirect_uri = process.env.REDIRECT_URI; // Redirect URI for OAuth2 callback
const SCOPES = process.env.SCOPES; // Scopes define the API access level
const TOKEN_PATH = process.env.TOKEN_PATH; // File path to store the token


// Function to authorize with Google OAuth2
async function authorize() {
    // Define the credentials object for OAuth2
    const credentials = {
        client_id,
        client_secret,
        redirect_uris: [redirect_uri],
    };

    /**
     * getNewToken - Handles generating a new OAuth2 token
     * @param {object} oAuth2Client - OAuth2 client object
     * @param {function} callback - Callback function to handle after getting the token
     */
    function getNewToken(oAuth2Client, callback) {
        // Generate the authentication URL for user consent
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', // Ensures the token can be refreshed
            scope: SCOPES, // API scopes
        });

        // Log the URL to prompt the user to visit and authorize the app
        console.log('Authorize this app by visiting this URL:', authUrl);

        // Prompt user for authorization code
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        // Read the authorization code from the terminal
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close(); // Close the readline interface after code is entered

            // Exchange the authorization code for an access token
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);

                // Set credentials for OAuth2 client
                oAuth2Client.setCredentials(token);

                // Store the token to the specified file path for future use
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });

                // Call the callback with the authorized client
                callback(oAuth2Client);
            });
        });
    }

    /**
     * authorizeWithCallback - Manages the authorization process
     * @param {object} credentials - OAuth2 credentials (client ID, secret, redirect URI)
     * @param {function} callback - Callback function to execute after authorization
     */
    function authorizeWithCallback(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials;

        // Create a new OAuth2 client instance
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Try reading the token file to check if an existing token is available
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                // If token doesn't exist, get a new one by calling getNewToken
                return getNewToken(oAuth2Client, callback);
            }

            // If token exists, set it to the OAuth2 client and continue
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client); // Pass the authorized client to the callback
        });
    }

    // Return a Promise that resolves with the authorized OAuth2 client
    return new Promise((resolve, reject) => {
        authorizeWithCallback(credentials, (oAuth2Client) => {
            resolve(oAuth2Client); // Resolve the promise with the OAuth2 client
        });
    });
}

// Export the authorize function for use in other parts of the application
module.exports = { authorize };