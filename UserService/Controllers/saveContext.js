const dotenv = require("dotenv");
const Context = require("../Models/ContextModel");

dotenv.config();



/**
 * Saves user context data (name, email, and context text) to MongoDB.
 * 
 * @param {object} req - Express request object containing the context data.
 * @param {object} res - Express response object for sending the result of the operation.
 */
const saveContext = async (req, res) => {
  const { context, name, emailId } = req.body; 
  if (!context || !name || !emailId) {
      return res.status(400).json({ message: "Missing required fields" });
  }

  // Save the context data to MongoDB
  try {
      const newContext = new Context({
          name,
          email: emailId,
          context, 
      });

      await newContext.save(); 

      res.status(200).json({ message: "Context saved successfully" });
  } catch (error) {
      console.error("Error saving context:", error);
      res.status(500).json({ message: "Failed to save context" });
  }
};



module.exports = { saveContext };