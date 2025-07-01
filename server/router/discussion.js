const express = require("express");
const {
  discussoinHandler,
  discussionGetDataHandler,
  discussionDeleteHandler,
} = require("../controller/discussion");

const router = express.Router();

router.post("/postData", discussoinHandler);
router.post("/getData", discussionGetDataHandler);
router.post("/delete", discussionDeleteHandler);

module.exports = router;
