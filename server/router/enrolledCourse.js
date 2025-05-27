const express = require("express");
const { enrolledCourseHandler } = require("../controller/enrolledCourse");

const router = express.Router();

router.post("/", enrolledCourseHandler);

module.exports = router;
