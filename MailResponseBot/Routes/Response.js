const express = require("express");
const { generateResponse } = require("../Controllers/ResponseController");

const router = express.Router();

router.post("/", generateResponse);

module.exports = router;