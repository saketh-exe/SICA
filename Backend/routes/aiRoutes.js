const express = require("express");
const { generateResponse } = require("../controllers/aiController");

const router = express.Router();

router.post("/api/models", generateResponse);

module.exports = router;
