/**
 * Defines API routes for user authentication and context management.
 * This router handles the following endpoints:
 * - POST `/auth`: Handles user authentication using the `authorize` controller.
 * - POST `/saveContext`: Saves user context (e.g., contacts or other data) using the `saveContext` controller.
 * 
 * These routes are part of the server's interaction with the front-end for managing user data.
 */

const express = require("express"); 
const { emailHistory , deleteToken } = require("../Controllers/saveContext");
const {summarizeConversations ,fetchsummarizeConversations } = require("../Controllers/SummarizeController");
const { getDashboardStats } = require("../Controllers/dashboardcontroller");
const router = express.Router();

router.get("/contextData/:email", emailHistory);
router.get("/summarize/:email", summarizeConversations);
router.get("/fetchSummary/:email", fetchsummarizeConversations);
router.get("/dashBoardMetrics", getDashboardStats);
router.delete("/token/:email", deleteToken);


module.exports = router;