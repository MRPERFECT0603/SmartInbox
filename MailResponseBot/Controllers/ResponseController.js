const axios = require("axios");

const generateResponse = async (emailContent) => {
    try {
        // Define the URL of your Docker container with the Ollama model
        const url = 'http://localhost:11434/api/generate'; // Update the URL if necessary

        const AiPrompt = "Generate a first-person reply to this email, ensuring it is direct and without any additional commentary:" + emailContent
        // Make a POST request to the Ollama model API
        const response = await axios.post(url, {
            "model": "vivu",
            "prompt": AiPrompt,
            "stream": false
        });

        // Return the generated response from the API
        return response.data; // Adjust based on your API response structure
    } catch (error) {
        console.error('Error generating response:', error.message);
        throw new Error('Failed to generate response');
    }
};


module.exports = { generateResponse }