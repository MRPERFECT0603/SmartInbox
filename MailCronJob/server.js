const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectdb = require("./Config/dbConfig");
const PORT = process.env.PORT || 3001; 
const { createMetricsDocument } = require("./services/metricsServices");
// Import the NewMailFetchJob from the cronjobs directory to fetch new mails periodically
const { NewMailFetchJob } = require("./cronjobs/newMails");
const { oAuth2Client, handleCallback } = require("./services/authService");
connectdb();



const app = express();

app.use(express.json());


createMetricsDocument();
// Start the cron job for fetching new mails; this job will run at specified intervals
NewMailFetchJob.start();


app.get('/callback', handleCallback);



app.listen(PORT, () => {
    console.log(` MailCronJob Server is running on port ${PORT}`); 
});