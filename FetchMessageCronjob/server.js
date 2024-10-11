// Import the Express library to create a web server
const express = require("express");

// Import the dotenv library to manage environment variables
const dotenv = require("dotenv");

// Load environment variables from the .env file into process.env
dotenv.config();

// Import the NewMailFetchJob from the cronjobs directory to fetch new mails periodically
const { NewMailFetchJob } = require("./cronjobs/newMails");

// Define the port on which the server will run, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT || 3001; 

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests, making the request body available as req.body
app.use(express.json());

// Start the cron job for fetching new mails; this job will run at specified intervals
NewMailFetchJob.start();

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
});