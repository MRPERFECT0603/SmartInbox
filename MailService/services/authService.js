
const { google } = require('googleapis');
const fs = require('fs');
const dotenv = require("dotenv");
const openURL = require("openurl");
const Context = require("../Models/ContextModel");

dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const SCOPES = process.env.SCOPES.split(',');

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

/**
 * Handles the OAuth2 callback and saves the access token to the database.
 *
 * This function processes the authorization code received from the OAuth2 flow, exchanges it 
 * for access tokens, sets the credentials for the `oAuth2Client`, and saves the tokens 
 * securely in MongoDB. It also emits events to signal the success or failure of the operation.
 *
 * @async
 * @function handleCallback
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters in the request.
 * @param {string} req.query.code - The authorization code received from the OAuth2 provider.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends an HTTP response indicating the success or failure of the operation:
 * - **200**: Tokens were successfully saved, and the user is granted access.
 * - **400**: The authorization code is missing.
 * - **500**: An error occurred during token processing or saving.
 *
 * @throws {Error} Logs any error during the token exchange or database operation.
 */
async function handleCallback(req, res) {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).send('Authorization code is missing.');
        }

        const { tokens } = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(tokens);

        const savedToken = JSON.stringify(tokens);
        const filter = { email: 'irctcvivek62@gmail.com' };
        const update = { token: savedToken };

        const result = await Context.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, 
        });

        console.log('Token saved to database:', result);

        oAuth2Client.emit('tokensSaved', null);

        res.status(200).send('Access Granted');
    } catch (error) {
        console.error('Error handling callback:', error);

        oAuth2Client.emit('tokensSaved', error);

        res.status(500).send('An error occurred during authentication.');
    }
}

/**
 * Generates a new OAuth2 authorization URL and handles the token retrieval process.
 *
 * This function generates an authorization URL for the user to grant permissions to the app. 
 * Once the user completes the authorization process, it listens for the `tokensSaved` event 
 * emitted by the `oAuth2Client` during the `handleCallback` function. If successful, it signals 
 * the completion of the token save process via the provided callback.
 *
 * @function getNewToken
 * @param {Object} oAuth2Client - The configured OAuth2 client instance.
 * @param {Function} callback - A callback function to handle the result:
 * - **callback(error, result)**: 
 *   - `error`: Contains the error object if token retrieval fails.
 *   - `result`: A boolean (`true`) indicating the token was saved successfully.
 *
 * @returns {void} Generates the authorization URL and listens for token save events.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'select_account',
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    openURL.open(authUrl);

    oAuth2Client.once('tokensSaved', (error) => {
        if (error) {
            return callback(error);
        }
        callback(null, true); 
    });
}
/**
 * Handles the authorization process for the OAuth2 client.
 *
 * This function checks if a token exists in the MongoDB database for the specified user. 
 * If no token is found or if the token is invalid, it initiates the token generation flow. 
 * Otherwise, it sets the credentials for the `oAuth2Client` and resolves the promise with 
 * the configured client.
 *
 * @async
 * @function authorize
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} Resolves with the configured `oAuth2Client` or handles the 
 * token generation flow.
 */
async function authorize(req, res) {
    return new Promise(async (resolve, reject) => {
    try {
        const userContext = await Context.findOne({ email: 'irctcvivek62@gmail.com' });
        
        if (!userContext || userContext.token === " ") {
            return new Promise((resolve, reject) => {
                getNewToken(oAuth2Client, async (callbackError, tokenSaved) => {
                    if (callbackError) {
                        return reject(callbackError);
                    }
                    resolve(tokenSaved); 
                });
            })
            .then(() => res.status(200).send('Authorization completed, token saved.'))
            .catch(error => {
                console.error('Error during authorization:', error);
                res.status(500).send('Authorization failed.');
            });
        }

        oAuth2Client.setCredentials(JSON.parse(userContext.token));
        resolve(oAuth2Client);
    } catch (error) {
        console.error('Error fetching token from MongoDB:', error);
        res.status(500).send('Error during authorization.');
    }
    });
}


module.exports = { oAuth2Client, handleCallback, authorize };