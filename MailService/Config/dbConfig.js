/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * This function connects to the database specified in the `CONNECTION_STRING` environment variable.
 * 
 * Features:
 * - Logs a success message with the database host and name upon successful connection.
 * - Catches and logs any errors that occur during the connection process.
 * - Exits the process with a failure status if the connection fails.
 * 
 * Usage:
 * This function is intended to be called during server initialization to ensure the database
 * is connected before handling any incoming requests.
 */


const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("DataBase Connected:", connect.connection.host, connect.connection.name);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

};

module.exports = connectdb;