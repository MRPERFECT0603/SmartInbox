import sql from '../Config/dbConfig.js'; 

import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI configuration for embeddings
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
  });


async function generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  }

/**
 * Ensures the 'context' table exists in Supabase
 */
async function ensureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS context (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'user_input',
        importance INTEGER DEFAULT 2,
        embedding VECTOR(1536), -- Assuming OpenAI embedding size is 1536
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("Context table verified/created successfully.");
  } catch (error) {
    console.error("Error ensuring table exists:", error);
  }
}


const saveContext = async (req, res) => {
  const { context, name, emailId } = req.body;
  if (!context || !name || !emailId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Ensure the table exists before inserting data
    await ensureTableExists();

    // Generate embedding for the context text
    const embedding = await generateEmbedding(context);
    
    // Create a unique ID for the context entry
    const contextId = `context_${Date.now()}`;
    
    // Insert data into the Supabase PostgreSQL database
    await sql`
      INSERT INTO context (id, name, email, content, category, importance, embedding, created_at)
      VALUES (${contextId}, ${name}, ${emailId}, ${context}, 'user_input', 2, ${embedding}, NOW());
    `;

    res.status(200).json({ 
      message: "Context saved successfully to database",
      contextId: contextId
    });
  } catch (error) {
    console.error("Error saving context:", error);
    res.status(500).json({ message: "Failed to save context: " + error.message });
  }
};

export { saveContext };