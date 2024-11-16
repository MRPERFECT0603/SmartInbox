/**
 * Defines the Mongoose schema for storing user context information.
 * This schema is used to manage and persist user data, including their name, email, context, and authentication token.
 * 
 * Schema fields:
 * - `name`: The name of the user (String).
 * - `email`: The user's email address, which is unique to each context (String, unique).
 * - `context`: A string field to store additional context or metadata associated with the user.
 * - `token`: A string field to store the authentication token (default is an empty string).
 * 
 * Additional features:
 * - `timestamps`: Automatically adds `createdAt` and `updatedAt` fields to the document.
 */

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
            default: " ", 
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("Context", ContextSchema);