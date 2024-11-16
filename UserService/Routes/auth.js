/**
 * Defines API routes for user authentication and context management.
 * This router handles the following endpoints:
 * - POST `/auth`: Handles user authentication using the `authorize` controller.
 * - POST `/saveContext`: Saves user context (e.g., contacts or other data) using the `saveContext` controller.
 * 
 * These routes are part of the server's interaction with the front-end for managing user data.
 */

const express = require("express"); 
const { authorize, saveContext } = require("../Controllers/authController");
const router = express.Router();

/**
 * POST `/auth`
 * Handles user authentication requests.
 */
router.post("/auth", authorize);

/**
 * POST `/saveContext`
 * Handles requests to save user context (e.g., contacts or additional user data).
 */
router.post("/saveContext", saveContext);


module.exports = router;