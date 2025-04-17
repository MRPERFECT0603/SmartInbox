
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
        password: {
            type: String, 
        },
        context: {
            type: String,
            default: " " 
        },
        token: {
            type: String, 
            default: " " 
        },
        previousEmail: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("Context", ContextSchema);