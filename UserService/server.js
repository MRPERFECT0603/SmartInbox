/**
 * Entry point for the Express server.
 * This server serves as the primary interface for front-end users.
 * It handles API calls from the front-end, managing user contacts and authentication tokens.
 * The server integrates OAuth2 authentication, connects to a MongoDB database, 
 * and provides necessary endpoints for user interactions.
 */

// Import dependencies
const express = require("express"); 
const dotenv = require("dotenv"); 
const cors = require("cors"); 
dotenv.config(); 
const connectdb = require("./Config/dbConfig"); 

// Import configuration and controllers
const { oAuth2Client, handleCallback } = require("./Controllers/authController");


connectdb(); 


const app = express(); 
const PORT = process.env.PORT || 8101; 

app.use(cors({
    origin: ["http://localhost:5173" , "http://localhost:30000"],
    credentials: true, 
}));
app.use(express.json());

/**
 * Define routes:
 * - `/callback`: Handles OAuth2 callback using the `handleCallback` controller.
 * - `/api`: Serves API routes defined in the `./Routes/auth` module.
 */
app.get('/callback', handleCallback); 
app.use("/api", require("./Routes/auth")); 


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});