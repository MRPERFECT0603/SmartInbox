
const cron = require("node-cron");
const { authorize } = require("../services/authService"); 
const { listNewMailIds } = require("../services/mailService"); 
const { NewMailIdQueuePusher } = require("../services/queueService"); 
const { Increment } = require("../services/metricsServices");
const Context = require("../Models/ContextModel");

/**
 * NewMailFetchJob - Cron job to fetch new emails every minute
 * This job is scheduled to run every minute, authorizing the user, listing new messages,
 * and sending the first message's ID to the message queue.
 */

const NewMailFetchJob = cron.schedule('* * * * *', async () => {
    console.log('Cron running for all users');
  
    const users = await Context.find({ token: { $ne: " " } });
    // console.log(users);

    for (const user of users) {
      try {
        const auth = await authorize(user.email); 
        const data = await listNewMailIds(auth, user.email); 
  
        if (data.messages && data.messages.length > 0) {
          for (const message of data.messages) {
            Increment('mailCronJob.mailIdFetched');
            const MailCronJobMessage = {
              ...message, 
              email: user.email,
            };
            await NewMailIdQueuePusher(MailCronJobMessage); 
            Increment('mailCronJob.mailIdPushed');
            console.log(`Message from ${user.email} pushed to queue \n Message: ${JSON.stringify(MailCronJobMessage, null, 2)}`);
          }
        } else {
          console.log(`No new messages for ${user.email}`);
        }
      } catch (error) {
        console.error(`Error processing ${user.email}:`, error.message);
      }
    }
});

module.exports = { NewMailFetchJob };