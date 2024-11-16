
const express = require("express"); 
const { authorize , saveContext } = require("../Controllers/authController");


const router = express.Router();

router.post("/auth" , authorize );
router.post("/saveContext" , saveContext );

module.exports = router;