
/**
 * Handles OAuth2 authentication, token management, and context saving.
 * This controller facilitates interaction with the Google OAuth2 API, manages user authentication tokens,
 * and provides functionality to save user context data to MongoDB.
 * 
 * Features:
 * - `handleCallback`: Processes the OAuth2 callback and saves tokens to MongoDB.
 * - `getNewToken`: Generates an authorization URL and initiates user authorization for new tokens.
 * - `authorize`: Authorizes the user by using an existing token or initiating the token generation flow.
 * - `saveContext`: Saves user context data (e.g., name, email, and context) to MongoDB.
 */


const { google } = require('googleapis');
const dotenv = require("dotenv");
const openURL = require("openurl");
const Context = require("../Models/ContextModel");

dotenv.config();
const emailId = 'irctcvivek62@gmail.com';

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const SCOPES = process.env.SCOPES.split(',');

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

/**
 * Processes the OAuth2 callback and saves the authentication token to MongoDB.
 * Emits a `tokensSaved` event upon completion.
 * 
 * @param {object} req - Express request object containing the authorization code.
 * @param {object} res - Express response object for sending the result of the operation.
 */
async function handleCallback(req, res) {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).send('Authorization code is missing.');
        }

        const { tokens } = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(tokens);

        // Save the token to MongoDB
        const savedToken = JSON.stringify(tokens);
        const filter = { email: 'irctcvivek62@gmail.com' };
        const update = { token: savedToken };

        const result = await Context.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, 
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
 * Generates a new OAuth2 token and prompts the user for authorization via a browser.
 * Listens for token save completion and executes the provided callback.
 * 
 * @param {object} oAuth2Client - OAuth2 client object used for authorization.
 * @param {function} callback - Callback function to execute after user authorization.
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
        callback(null, true); 
    });
}

/**
 * Authorizes the client using the existing token or initiates the token generation flow.
 * Saves the token to MongoDB if a new one is generated.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object for sending the result of the authorization process.
 */
async function authorize(req, res) {
    try {
        const userContext = await Context.findOne({ email: emailId });
        
        if (!userContext || userContext.token === " ") {
            // No token, initiate the new token generation flow
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

        // Token exists, set credentials
        oAuth2Client.setCredentials(JSON.parse(userContext.token));
        res.status(200).send('Token already exists, authorization successful.');
    } catch (error) {
        console.error('Error fetching token from MongoDB:', error);
        res.status(500).send('Error during authorization.');
    }
}


/**
 * Saves user context data (name, email, and context text) to MongoDB.
 * 
 * @param {object} req - Express request object containing the context data.
 * @param {object} res - Express response object for sending the result of the operation.
 */
const saveContext = async (req, res) => {
    const { context, name, emailId } = req.body; 
    if (!context || !name || !emailId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Save the context data to MongoDB
    try {
        const newContext = new Context({
            name,
            email: emailId,
            context, 
        });

        await newContext.save(); 

        res.status(200).json({ message: "Context saved successfully" });
    } catch (error) {
        console.error("Error saving context:", error);
        res.status(500).json({ message: "Failed to save context" });
    }
};

module.exports = { oAuth2Client, handleCallback, authorize, saveContext };