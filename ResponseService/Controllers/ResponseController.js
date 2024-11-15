
const dotenv = require("dotenv"); 
const {responseGenerator} = require("../Controllers/RAG_AI_MODEL");
const Context = require("../Models/ContextModel");

dotenv.config();

/**
 * generateResponse - Function to generate a reply to an email using an AI model
 * This function makes a POST request to an API to generate a response based on the provided email content.
 * @param {string} emailContent - The content of the email to which a reply is to be generated
 * @returns {Promise<string>} - Returns a promise that resolves with the generated response from the AI model
 */
// const generateResponse = async (emailContent, userName) => {
//     try {
//         const url = process.env.OLLAMA_API_KEY; 

//         // Construct the AI prompt for the model
//         const AiPrompt = emailContent; // Use the email content directly as defined in the Modelfile

//         // Create the payload with the user's name
//         const payload = {
//             model: "otter", // Replace with the name of your created model
//             prompt: AiPrompt,
//             Name: userName, // Include user's name as part of the input
//             stream: false,
//             format: "json"
//         };

//         // Send the request to the Ollama API
//         const response = await axios.post(url, payload);

//         // Return the structured response from the assistant
//         return response.data;
//     } catch (error) {
//         console.error('Error generating response:', error.message);
//         throw new Error('Failed to generate response');
//     }
// };

const generateResponse = async (userName, emailContent) => {
    try {
        
        const response = await responseGenerator(userName , emailContent);
        console.log(response);

        // Return the structured response from the assistant
        return response;
    } catch (error) {
        console.error('Error generating response:', error.message);
        throw new Error('Failed to generate response');
    }
};

const saveContext = async (req, res) => {
    const { context, name, emailId } = req.body; // Extract data from the request body
  
    if (!context || !name || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Save the context data to MongoDB
    try {
      const newContext = new Context({
        name,
        email: emailId,
        context, // Save the context text
      });
  
      await newContext.save(); // Save to MongoDB
  
      res.status(200).json({ message: "Context saved successfully" });
    } catch (error) {
      console.error("Error saving context:", error);
      res.status(500).json({ message: "Failed to save context" });
    }
};


module.exports = { generateResponse , saveContext };