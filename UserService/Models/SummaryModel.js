

const mongoose = require("mongoose");

const SummarySchema = mongoose.Schema(
    {
        userEmail: {
            type: String, 
        },
        name: {
            type: String, 
        },
        totalMails: {
            type: Number, 
        },
        email: {
            type: String, 
            unique: true, 
        },
        summary: {
            type: String,
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("Summary", SummarySchema);