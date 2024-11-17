const mongoose = require("mongoose");

const ContextSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true, 
        },
        context: {
            type: String,
        },
        token: {
            type: String,
            default: " " 
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Context", ContextSchema);