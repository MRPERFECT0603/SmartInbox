
const express = require("express"); 
const { authorizeApi } = require("../Controllers/authContoller"); 


const router = express.Router();

router.post("/auth" , authorizeApi );

module.exports = router;