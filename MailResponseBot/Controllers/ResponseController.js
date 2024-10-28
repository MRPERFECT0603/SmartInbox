
const axios = require("axios"); 
const dotenv = require("dotenv"); 

dotenv.config();

/**
 * generateResponse - Function to generate a reply to an email using an AI model
 * This function makes a POST request to an API to generate a response based on the provided email content.
 * @param {string} emailContent - The content of the email to which a reply is to be generated
 * @returns {Promise<string>} - Returns a promise that resolves with the generated response from the AI model
 */
const generateResponse = async (emailContent) => {
    try {
        const url = process.env.OLLAMA_API_KEY; 

        // Construct the AI prompt for the model, instructing it to generate a direct reply
        const AiPrompt = "Generate a first-person reply to this email, ensuring it is direct and without any additional commentary:" + emailContent;

        const response = await axios.post(url, {
            "model": "vivu", 
            "prompt": AiPrompt, 
            "stream": false 
        });

        return response.data;
    } catch (error) {
        console.error('Error generating response:', error.message);

        throw new Error('Failed to generate response');
    }
};

module.exports = { generateResponse };