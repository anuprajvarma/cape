const express = require("express");
const {
  bookmarCourseHandler,
  getBookmarCourseHandler,
} = require("../controller/bookmarkCourse");

const router = express.Router();

router.post("/", bookmarCourseHandler);
router.post("/getData", getBookmarCourseHandler);

module.exports = router;
