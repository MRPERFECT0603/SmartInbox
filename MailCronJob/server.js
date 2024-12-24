const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectdb = require("./Config/dbConfig");
const PORT = process.env.PORT || 8102; 
const { createMetricsDocument } = require("./services/metricsServices");
const { NewMailFetchJob } = require("./cronjobs/newMails");
const { oAuth2Client, handleCallback } = require("./services/authService");
connectdb();



const app = express();

app.use(express.json());


createMetricsDocument();
NewMailFetchJob.start();


app.get('/callback', handleCallback);



app.listen(PORT, () => {
    console.log(` MailCronJob Server is running on port ${PORT}`); 
});