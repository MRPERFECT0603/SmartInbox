
const cron = require("node-cron");
const { authorize } = require("../services/authService"); 
const { listMessages } = require("../services/mailService"); 
const { NewMailFetcher } = require("../services/queueService"); 
const { Increment } = require("../services/metricsServices");
const Context = require("../Models/ContextModel");

/**
 * NewMailFetchJob - Cron job to fetch new emails every minute
 * This job is scheduled to run every minute, authorizing the user, listing new messages,
 * and sending the first message's ID to the message queue.
 */

const NewMailFetchJob = cron.schedule('* * * * *', async () => {
    console.log('🔄 Cron running for all users...');
  
    const users = await Context.find({ token: { $ne: " " } });
    console.log(users);

    for (const user of users) {
      try {
        const auth = await authorize(user.email); 
        const data = await listMessages(auth, user.email); 
  
        if (data.messages && data.messages.length > 0) {
          for (const message of data.messages) {
            Increment('mailCronJob.mailIdFetched');
            await NewMailFetcher({ message, user }); 
            Increment('mailCronJob.mailIdPushed');
            console.log(`📬 Message from ${user.email} pushed to queue`);
          }
        } else {
          console.log(`📭 No new messages for ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error.message);
      }
    }
});

// const NewMailFetchJob = cron.schedule('* * * * *', () => {
//     console.log('Cron job running every  minute'); 

//     authorize().then(auth => {
//         console.log('Authorized successfully');
//         console.log("Listing New MessageId Started"); 
//         listMessages(auth).then(data => {
//             if (data.messages && data.messages.length > 0) {
//                 data.messages.forEach(message => {
//                     Increment('mailCronJob.mailIdFetched');
//                     NewMailFetcher(message)
//                         .catch(console.error); 
//                     console.log(`MESSAGE SENT from the MailCronJob to the MailzyExchange: ${message}`);
//                     Increment('mailCronJob.mailIdPushed');
//                     console.log("Listing New MessageId Ended"); 
//                 }); 
//             } else {
//                 console.log("NO New Message in the Inbox found."); 
//             }
//         });
//     });
// });

module.exports = { NewMailFetchJob };