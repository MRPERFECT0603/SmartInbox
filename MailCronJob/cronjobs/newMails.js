const cron = require("node-cron");
const { authorize } = require("../services/authService");
const { listNewMailIds } = require("../services/mailService");
const { NewMailIdQueuePusher } = require("../services/queueService");
const { Increment } = require("../services/metricsServices");
const Context = require("../Models/ContextModel");


const NewMailFetchJob = cron.schedule('* * * * *', async () => {
  const users = await Context.find({ token: { $ne: " " } });

  if (!users || users.length === 0) {
    console.warn(JSON.stringify({
      level: "warn",
      service: "mail-cronjob",
      event: "no_users_with_valid_tokens",
      message: "No users found with valid tokens. Skipping mail fetch job.",
      timestamp: new Date().toISOString()
    }));
    return;
  }

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
          console.log(JSON.stringify({
            level: "info",
            service: "mail-cronjob",
            event: "mail_pushed_to_queue",
            message: "Mail ID pushed to queue",
            email: user.email,
            mailId: message.id,
            timestamp: new Date().toISOString()
          }));
        }
      } else {
        console.log(JSON.stringify({
          level: "info",
          service: "mail-cronjob",
          event: "no_new_messages",
          message: "No new messages for user",
          email: user.email,
          timestamp: new Date().toISOString()
        }));
      }

    } catch (error) {
      console.error(JSON.stringify({
        level: "error",
        service: "mail-cronjob",
        event: "mail_processing_error",
        message: `Error while processing email`,
        email: user.email,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }));
    }
  }
});


module.exports = { NewMailFetchJob };