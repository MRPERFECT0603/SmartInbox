/**
 * Defines API routes for user authentication and context management.
 * This router handles the following endpoints:
 * - POST `/auth`: Handles user authentication using the `authorize` controller.
 * - POST `/saveContext`: Saves user context (e.g., contacts or other data) using the `saveContext` controller.
 * 
 * These routes are part of the server's interaction with the front-end for managing user data.
 */

const express = require("express"); 
const { authorize } = require("../Controllers/authController");
const { saveContext } = require("../Controllers/saveContext");
const router = express.Router();

router.post("/auth", authorize);

router.post("/saveContext", saveContext);


module.exports = router;