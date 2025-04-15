const express = require("express");
const connectdb = require("./Config/dbConfig");
const { createMetricsDocument } = require("./services/metricsServices");
const { NewMailFetchJob } = require("./cronjobs/newMails");
const { handleCallback } = require("./services/authService");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 8102;

const app = express();

connectdb();
app.use(express.json());



// Routes
app.get("/callback", handleCallback);


app.listen(PORT, () => {
    console.log(`MailCronJob Server running at http://localhost:${PORT}`);
    createMetricsDocument(); 
    NewMailFetchJob.start(); 
});


process.on("SIGINT", () => {
    console.log("Server shutting down...");
    NewMailFetchJob.stop();
    process.exit(0);
});