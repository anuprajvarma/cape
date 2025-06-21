const express = require("express");
const {
  addUserScoreHandler,
  //   getUserScoreHandler,
} = require("../controller/score");

const router = express.Router();

router.post("/addUserScore", addUserScoreHandler);
// router.post("/getUserScore", getUserScoreHandler);

module.exports = router;
