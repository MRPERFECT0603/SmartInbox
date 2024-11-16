const mongoose = require("mongoose");

const ContextSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true, // Ensure email is unique for each context
        },
        context: {
            type: String,
        },
        token: {
            type: String,
            default: " " // Store the token as a stringified JSON
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Context", ContextSchema);