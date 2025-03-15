const express = require("express");
const { addChat, getUserChats , deleteChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/addChat", addChat);
router.get("/getUserChats", getUserChats);
router.delete("/deleteChat", deleteChat);

module.exports = router;
