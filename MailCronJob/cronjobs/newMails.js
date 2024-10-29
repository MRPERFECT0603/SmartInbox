
const cron = require("node-cron");

const { authorize } = require("../services/authService"); 
const { listMessages } = require("../services/mailService"); 
const { NewMailFetcher } = require("../services/queueService"); 
/**
 * NewMailFetchJob - Cron job to fetch new emails every minute
 * This job is scheduled to run every minute, authorizing the user, listing new messages,
 * and sending the first message's ID to the message queue.
 */
const NewMailFetchJob = cron.schedule('* * * * *', () => {
    console.log('Cron job running every minute'); 

    // Authorize the user and handle the returned authentication object
    authorize().then(auth => {
        console.log('Authorized successfully'); 
        // List messages using the authorized client
        listMessages(auth).then(data => {
            // If there are messages, send the ID of the first message to the queue
            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(message => {
                    NewMailFetcher(message) // Send each message's ID to the queue
                        .catch(console.error); // Catch and log any errors that occur
                    console.log(`MESSAGE SENT: ${message}`); // Log that the message ID has been sent
                }); 
            } else {
                console.log("No new messages found."); 
            }
        });
    });
});

module.exports = { NewMailFetchJob };