const express = require("express");
const { chatHandler, chatDataGet } = require("../controller/chat");

const router = express.Router();

router.post("/", chatHandler);
router.post("/getData", chatDataGet);

module.exports = router;
