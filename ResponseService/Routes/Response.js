const express = require("express"); 
const { generateResponse , saveContext } = require("../Controllers/ResponseController"); 


const router = express.Router();

// router.post("/", generateResponse);
router.post("/saveContext" , saveContext );

module.exports = router;