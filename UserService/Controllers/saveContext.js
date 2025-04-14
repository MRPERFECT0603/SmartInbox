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
  const { context, name, emailId, password } = req.body;

  // Check for missing fields
  if (!context || !name || !emailId || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user by email and update their context or create a new one if not found
    const updatedContext = await Context.findOneAndUpdate(
      { email: emailId }, // Search condition
      { 
        name,
        email: emailId,
        password,
        context
      }, 
      { 
        new: true,   // Return the updated document
        upsert: true // Create a new document if not found
      });

    // Respond with success
    res.status(200).json({ message: "Context saved/updated successfully", data: updatedContext });
  } catch (error) {
    console.error("Error saving/updating context:", error);
    res.status(500).json({ message: "Failed to save/update context" });
  }
};

/**
 * Fetches email history (smart replies) for a given user email from MongoDB.
 * 
 * @param {object} req - Express request object containing the email param.
 * @param {object} res - Express response object for sending the result.
 */


const emailHistory = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }
  
    try {
      const contextDoc = await Context.findOne({ email });
  
      if (!contextDoc) {
        return res.status(404).json({ message: "No email found" });
      }
  
      res.status(200).json({ contextDoc });
    } catch (error) {
      console.error("Error fetching email history:", error);
      res.status(500).json({ message: "Failed to fetch email history" });
    }
  };


  const deleteToken = async (req, res) => {
    const { email } = req.params;

  
    try {
      const updatedUser = await Context.findOneAndUpdate(
        { email },              
        { token: " " },         
        { new: true }           
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Token deleted successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error deleting token:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email , password);
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      const user = await Context.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Optional: generate and send token here (JWT, session ID, etc.)
  
      res.status(200).json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          context: user.context,
        },
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

module.exports = { saveContext , emailHistory , deleteToken , login};