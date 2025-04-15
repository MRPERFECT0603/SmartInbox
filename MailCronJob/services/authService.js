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
 * Handles the OAuth2 callback and processes the authorization code
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function handleCallback(req, res) {
    try {
        const code = req.query.code;
        const email = decodeURIComponent(req.query.state);

        if (!code || !email) {
            console.warn(JSON.stringify({
                level: "warn",
                service: "auth-service_mailcronjob",
                event: "missing_code_or_email",
                message: "Authorization code or email missing in callback",
                timestamp: new Date().toISOString()
            }));
            return res.status(400).send('Authorization code or email is missing.');
        }

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const savedToken = JSON.stringify(tokens);
        const filter = { email };
        const update = { token: savedToken };

        const result = await Context.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, 
        });

        console.log(JSON.stringify({
            level: "info",
            service: "auth-service_mailcronjob",
            event: "token_saved",
            message: "OAuth token saved successfully",
            email,
            token_expires: tokens.expiry_date,
            timestamp: new Date().toISOString()
        }));

        oAuth2Client.emit('tokensSaved', null);
        res.status(200).send('Access Granted');
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            service: "auth-service_mailcronjob",
            event: "callback_error",
            message: "Error handling OAuth2 callback",
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }));

        oAuth2Client.emit('tokensSaved', error);
        res.status(500).send('An error occurred during authentication.');
    }
}

/**
 * Generates a new OAuth2 token and prompts the user for authorization
 * @param {object} oAuth2Client - OAuth2 client object
 * @param {string} email - The email address used to track token context
 * @param {function} callback - Callback function executed after authorization
 */
function getNewToken(oAuth2Client, email, callback) {
    const state = encodeURIComponent(email);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'select_account',
        state
    });

    console.log(JSON.stringify({
        level: "info",
        service: "auth-service_mailcronjob",
        event: "auth_url_generated",
        message: "Prompting user for OAuth authorization",
        email,
        authUrl,
        timestamp: new Date().toISOString()
    }));

    openURL.open(authUrl);

    oAuth2Client.once('tokensSaved', (error) => {
        if (error) {
            return callback(error);
        }
        callback(null, true); 
    });
}

/**
 * Authorizes the client using existing token or initiates a new token flow
 * @param {string} email - User email to fetch token from DB or start new flow
 * @returns {Promise<object>} - Resolves with authorized oAuth2Client
 */
async function authorize(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const userContext = await Context.findOne({ email });

            if (!userContext || userContext.token === " ") {
                console.log(JSON.stringify({
                    level: "info",
                    service: "auth-service_mailcronjob",
                    event: "no_token_found",
                    message: "No token found in DB. Starting OAuth flow.",
                    email,
                    timestamp: new Date().toISOString()
                }));

                return new Promise((resolve, reject) => {
                    getNewToken(oAuth2Client, email, async (callbackError, tokenSaved) => {
                        if (callbackError) {
                            return reject(callbackError);
                        }
                        resolve(tokenSaved); 
                    });
                })
                .then(() => console.log(JSON.stringify({
                    level: "info",
                    service: "auth-service_mailcronjob",
                    event: "authorization_complete",
                    message: "User authorization completed and token saved",
                    email,
                    timestamp: new Date().toISOString()
                })))
                .catch(error => {
                    console.error(JSON.stringify({
                        level: "error",
                        service: "auth-service_mailcronjob",
                        event: "authorization_error",
                        message: "Error during user authorization",
                        email,
                        error: error.message,
                        stack: error.stack,
                        timestamp: new Date().toISOString()
                    }));
                    reject(error);
                });
            }

            oAuth2Client.setCredentials(JSON.parse(userContext.token));
            resolve(oAuth2Client);
        } catch (error) {
            console.error(JSON.stringify({
                level: "error",
                service: "auth-service_mailcronjob",
                event: "fetch_token_error",
                message: "Error fetching token from DB",
                email,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }));
            reject(error);
        }
    });
}

module.exports = { oAuth2Client, handleCallback, authorize };