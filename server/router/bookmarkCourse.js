const express = require("express");
const {
  bookmarCourseHandler,
  getBookmarCourseHandler,
  deleteBookmarCourseHandler,
} = require("../controller/bookmarkCourse");

const router = express.Router();

router.post("/", bookmarCourseHandler);
router.post("/getData", getBookmarCourseHandler);
router.post("/delete", deleteBookmarCourseHandler);

module.exports = router;
