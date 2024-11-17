
const cron = require("node-cron");

const { authorize } = require("../services/authService"); 
const { listMessages } = require("../services/mailService"); 
const { NewMailFetcher } = require("../services/queueService"); 
const { Increment } = require("../services/metricsServices");

/**
 * NewMailFetchJob - Cron job to fetch new emails every minute
 * This job is scheduled to run every minute, authorizing the user, listing new messages,
 * and sending the first message's ID to the message queue.
 */
const NewMailFetchJob = cron.schedule('* * * * *', () => {
    console.log('Cron job running every  minute'); 

    // Authorize the user and handle the returned authentication object
    authorize().then(auth => {
        console.log('Authorized successfully');
        console.log("Listing New MessageId Started"); 
        listMessages(auth).then(data => {
            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(message => {
                    Increment('mailCronJob.mailIdFetched');
                    NewMailFetcher(message)
                        .catch(console.error); 
                    console.log(`MESSAGE SENT from the MailCronJob to the MailzyExchange: ${message}`);
                    Increment('mailCronJob.mailIdPushed');
                    console.log("Listing New MessageId Ended"); 
                }); 
            } else {
                console.log("NO New Message in the Inbox found."); 
            }
        });
    });
});

module.exports = { NewMailFetchJob };