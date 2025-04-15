const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(JSON.stringify({
            level: "info",
            service: "mail_service",
            event: "mongo_connection_success",
            message: "MongoDB connected successfully",
            host: connect.connection.host,
            database: connect.connection.name,
            timestamp: new Date().toISOString()
        }));
    }
    catch (err) {
        console.error(JSON.stringify({
            level: "error",
            service: "mail_service",
            event: "mongo_connection_error",
            message: "Error connecting to MongoDB",
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }));
        process.exit(1);
    }
};

module.exports = connectdb; 