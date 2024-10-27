const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001; 
// Import the NewMailFetchJob from the cronjobs directory to fetch new mails periodically
const { NewMailFetchJob } = require("./cronjobs/newMails");
const { oAuth2Client, handleCallback } = require("./services/authService");



const app = express();

// Middleware to parse incoming JSON requests, making the request body available as req.body
app.use(express.json());

// Start the cron job for fetching new mails; this job will run at specified intervals
NewMailFetchJob.start();

// Route to handle OAuth2 callback
// Callback route for Google OAuth2
app.get('/callback', handleCallback);

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});