const express = require("express");
const { addQuizzHandler, getQuizzDataHandler } = require("../controller/quizz");

const router = express.Router();

router.post("/addQiuzzes", addQuizzHandler);
router.post("/getQiuzzData", getQuizzDataHandler);

module.exports = router;
