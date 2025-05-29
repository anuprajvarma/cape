const express = require("express");
const {
  enrolledCourseHandler,
  getEnrolledCourseHandler,
  deleteEnrolledCourseHandler,
  appChapterHandler,
  removeChapterHandler,
  getChapterData,
} = require("../controller/enrolledCourse");

const router = express.Router();

router.post("/", enrolledCourseHandler);
router.post("/getData", getEnrolledCourseHandler);
router.post("/delete", deleteEnrolledCourseHandler);
router.post("/addChapter", appChapterHandler);
router.post("/removeChapter", removeChapterHandler);
router.post("/getChapterData", getChapterData);

module.exports = router;
