
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

        const savedToken = JSON.stringify(tokens);
        const filter = { email: 'irctcvivek62@gmail.com' };
        const update = { token: savedToken };

        const result = await Context.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, 
        });

        console.log('Access Token saved in the database for the user', result);

        oAuth2Client.emit('tokensSaved', null);

        res.status(200).send(`
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Inter', sans-serif;
                    background-color: #CADCFC;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                  }
                  .message-container {
                    background-color: #f9fafb;
                    padding: 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                  }
                  .message {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #00246B; 
                  }
                  .close-message {
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    color: #1A3A6B;
                  }
                </style>
              </head>
              <body>
                <div class="message-container">
                  <div class="message">Access Granted. Now you can close this tab.</div>
                  <div class="close-message">Thank you for using our service!</div>
                </div>
              </body>
            </html>
          `);
    } catch (error) {
        console.error('Error handling callback:', error);

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
        oAuth2Client.setCredentials(JSON.parse(userContext.token));
        res.status(200).send('Token already exists, authorization successful.');
    } catch (error) {
        console.error('Error fetching token from MongoDB:', error);
        res.status(500).send('Error during authorization.');
    }
}



module.exports = { oAuth2Client, handleCallback, authorize };