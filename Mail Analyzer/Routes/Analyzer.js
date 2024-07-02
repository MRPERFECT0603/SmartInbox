const express = require("express");
const {  Analyzer } = require("../Controllers/AnalyzerController");

const router = express.Router();

router.post("/", Analyzer);

module.exports = router;