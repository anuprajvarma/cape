const express = require("express");
const {
  enrolledCourseHandler,
  getEnrolledCourseHandler,
  deleteEnrolledCourseHandler,
} = require("../controller/enrolledCourse");

const router = express.Router();

router.post("/", enrolledCourseHandler);
router.post("/getData", getEnrolledCourseHandler);
router.post("/delete", deleteEnrolledCourseHandler);

module.exports = router;
