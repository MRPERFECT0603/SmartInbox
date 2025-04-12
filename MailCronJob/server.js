const express = require("express");
const connectdb = require("./Config/dbConfig");
const { createMetricsDocument } = require("./services/metricsServices");
const { NewMailFetchJob } = require("./cronjobs/newMails");
const { handleCallback } = require("./services/authService");

require("dotenv").config();
const PORT = process.env.PORT || 8102; 


connectdb();
const app = express();

//MiddleWare
app.use(express.json());

//To Create a New Document everytime the Servers Restart.
createMetricsDocument();
//To Start the CronJob with the start of the server.
NewMailFetchJob.start();


app.get('/callback', handleCallback);

app.listen(PORT, () => {
    console.log(` MailCronJob Server is running on port ${PORT}`); 
});