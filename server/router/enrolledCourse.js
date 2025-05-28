const express = require("express");
const {
  enrolledCourseHandler,
  getEnrolledCourseHandler,
} = require("../controller/enrolledCourse");

const router = express.Router();

router.post("/", enrolledCourseHandler);
router.post("/getData", getEnrolledCourseHandler);

module.exports = router;
