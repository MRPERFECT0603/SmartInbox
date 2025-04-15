
const dotenv = require("dotenv");
const { responseGenerator } = require("../services/Groq");
const Context = require("../Models/ContextModel");

dotenv.config();


/**
 * Generates an AI-based response using the responseGenerator service.
 *
 * This function prepares the user data and email content, passes them to the response generator,
 * and returns the generated email reply structured with subject, greeting, body, and signature.
 *
 * @function generateResponse
 * @async
 * @param {string} userEmail - Email ID of the user who received the message.
 * @param {string} senderName - Name of the person who sent the original message.
 * @param {string} senderEmail - Email of the sender of the original message.
 * @param {string} emailContent - The content of the original message.
 * @returns {Promise<Object>} - A structured response containing subject, greeting, body, and signature.
 * @throws {Error} - Throws an error if the response generation fails.
 */
const generateResponse = async (userEmail, senderName, senderEmail, emailContent) => {
  try {
    const response = await responseGenerator(userEmail, senderName, senderEmail, emailContent);
    return response;
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      service: "response-service",
      event: "generate_response_failed",
      message: "Error while generating AI response",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
    throw new Error('Failed to generate response');
  }
};
/**
 * Saves the processed email history (user prompt and AI response) into MongoDB under user's context.
 *
 * This function pushes a combined string of the sender’s message and AI-generated reply to the
 * `previousEmail` array inside the Context document for the given user.
 *
 * @function saveEmailHistory
 * @async
 * @param {Object} EmailHistory - An object containing the full email history details.
 * @param {string} EmailHistory.userEmail - The email of the user receiving the response.
 * @param {string} EmailHistory.sender - The original sender's name or email.
 * @param {string} EmailHistory.messageData - The original message content.
 * @param {Object} EmailHistory.response - The structured AI-generated reply object.
 * @returns {Promise<void>} - Resolves when the history is successfully updated.
 */

const saveEmailHistory = async (EmailHistory) => {
  try {
    const combinedString = `From: ${EmailHistory.sender} | Message: ${EmailHistory.messageData} | Response: ${JSON.stringify(EmailHistory.response)}`;

    const updatedContext = await Context.findOneAndUpdate(
      { email: EmailHistory.userEmail },
      { $push: { previousEmail: combinedString } },
      { new: true }
    );

    if (!updatedContext) {
      console.warn(JSON.stringify({
        level: "warn",
        service: "response-service",
        event: "context_not_found",
        message: "No user context found while trying to save email history",
        email: EmailHistory.userEmail,
        timestamp: new Date().toISOString()
      }));
      console.log(JSON.stringify({
        level: "info",
        service: "response-service",
        event: "email_history_saved",
        message: "Successfully saved email history to user context",
        email: EmailHistory.userEmail,
        timestamp: new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      service: "response-service",
      event: "save_email_history_failed",
      message: "Error while updating user context with email history",
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
};

module.exports = { saveEmailHistory, generateResponse };