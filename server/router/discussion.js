const express = require("express");
const {
  discussoinHandler,
  discussionGetDataHandler,
} = require("../controller/discussion");

const router = express.Router();

router.post("/postData", discussoinHandler);
router.post("/getData", discussionGetDataHandler);

module.exports = router;
