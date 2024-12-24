

const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DataBase Connected with the User Service with :-", connect.connection.host, connect.connection.name);
    }
    catch (err) {
        console.error("Error connecting to the database in the MailCronJob Service", err);
        process.exit(1);
    }

};

module.exports = connectdb;