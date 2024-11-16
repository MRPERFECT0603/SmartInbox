
// Import necessary modules
const { google } = require('googleapis');
const fs = require('fs');
const dotenv = require("dotenv");
const openURL = require("openurl");
const Context = require("../Models/ContextModel");

dotenv.config();
const emailId = 'irctcvivek62@gmail.com';
// Extract values from environment variables
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const SCOPES = process.env.SCOPES.split(',');
const TOKEN_PATH = process.env.TOKEN_PATH;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

/**
 * Handles the OAuth2 callback and processes the authorization code
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function handleCallback(req, res) {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).send('Authorization code is missing.');
        }

        const { tokens } = await oAuth2Client.getToken(code);

        // Set the credentials with the received token
        oAuth2Client.setCredentials(tokens);

        // Save the token to MongoDB
        const savedToken = JSON.stringify(tokens);
        const filter = { email: 'irctcvivek62@gmail.com' };
        const update = { token: savedToken };

        const result = await Context.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, // This creates the document if it doesn't exist
        });

        console.log('Token saved to database:', result);

        // Emit an event indicating tokens are saved
        oAuth2Client.emit('tokensSaved', null);

        res.status(200).send('Access Granted');
    } catch (error) {
        console.error('Error handling callback:', error);

        // Emit an event indicating error during token save
        oAuth2Client.emit('tokensSaved', error);

        res.status(500).send('An error occurred during authentication.');
    }
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

    // Listen for token save completion in handleCallback
    oAuth2Client.once('tokensSaved', (error) => {
        if (error) {
            return callback(error);
        }
        callback(null, true); // Signal token saved
    });
}

/**
 * Authorizes the client using the existing token or initiates the token generation flow
 */
async function authorize(req, res) {
    return new Promise(async (resolve, reject) => {
    try {
        const userContext = await Context.findOne({ email: emailId });
        
        if (!userContext || userContext.token === " ") {
            // No token, initiate the new token generation flow
            return new Promise((resolve, reject) => {
                getNewToken(oAuth2Client, async (callbackError, tokenSaved) => {
                    if (callbackError) {
                        return reject(callbackError);
                    }
                    resolve(tokenSaved); // Resolve when token is saved
                });
            })
            .then(() => res.status(200).send('Authorization completed, token saved.'))
            .catch(error => {
                console.error('Error during authorization:', error);
                res.status(500).send('Authorization failed.');
            });
        }

        // Token exists, set credentials
        oAuth2Client.setCredentials(JSON.parse(userContext.token));
        resolve(oAuth2Client);
    } catch (error) {
        console.error('Error fetching token from MongoDB:', error);
        res.status(500).send('Error during authorization.');
    }
    });
}


module.exports = { oAuth2Client, handleCallback, authorize };