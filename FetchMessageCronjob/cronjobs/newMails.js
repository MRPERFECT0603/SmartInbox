// Import the node-cron module for scheduling tasks
const cron = require("node-cron");

// Import the necessary functions from service modules
const { authorize } = require("../services/authService"); // Function to authorize with Google services
const { listMessages } = require("../services/mailService"); // Function to list messages from Gmail
const { NewMailFetcher } = require("../services/queueService"); // Function to send new mail data to the queue

/**
 * NewMailFetchJob - Cron job to fetch new emails every minute
 * This job is scheduled to run every minute, authorizing the user, listing new messages,
 * and sending the first message's ID to the message queue.
 */
const NewMailFetchJob = cron.schedule('* * * * *', () => {
    console.log('Cron job running every minute'); // Log to indicate the cron job execution

    // Authorize the user and handle the returned authentication object
    authorize().then(auth => {
        console.log('Authorized successfully'); // Log success message for authorization

        // List messages using the authorized client
        listMessages(auth).then(data => {
            // If there are messages, send the ID of the first message to the queue
            if (data.messages && data.messages.length > 0) {
                NewMailFetcher(data.messages[0].id).catch(console.error); // Push the message ID to the queue
                console.log("MESSAGE SEND"); // Log to indicate the message has been sent
            } else {
                console.log("No new messages found."); // Log if no new messages are available
            }
        });
    });
});

// Export the NewMailFetchJob for use in other modules
module.exports = { NewMailFetchJob };