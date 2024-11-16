const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectdb = require("./Config/dbConfig");
const PORT = process.env.PORT || 3001; 
// Import the NewMailFetchJob from the cronjobs directory to fetch new mails periodically
const { oAuth2Client, handleCallback } = require("./Controllers/authController");
connectdb();



const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }));
// Middleware to parse incoming JSON requests, making the request body available as req.body
app.use(express.json());



// Route to handle OAuth2 callback
// Callback route for Google OAuth2
app.get('/callback', handleCallback);
app.use("/api", require("./Routes/auth"));

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});