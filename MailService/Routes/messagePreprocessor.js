const express = require("express");
const { preprocessor } = require("../Controllers/preprocessorController");

const router = express.Router();

router.get("/", preprocessor);

module.exports = router;