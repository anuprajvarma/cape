const EnrolledkCourse = require("../models/enrolledCourse");

const enrolledCourseHandler = async (req, res) => {
  const {
    title,
    channelTitle,
    thumbnails,
    lenth,
    channelThumb,
    id,
    description,
    firstVideoId,
    bookmark,
    email,
  } = req.body;
  let enrolledkCourse = await EnrolledkCourse.findOne({
    playlistId: id,
    email,
  });

  // console.log(`google call ${email}`);

  if (!enrolledkCourse) {
    enrolledkCourse = await EnrolledkCourse.create({
      email: email,
      thumbnail: thumbnails,
      playlistId: id,
      playlistDescription: description,
      chapterLenth: lenth,
      firstVideoId: firstVideoId,
      title: title,
      bookmark: bookmark,
      channelTitle: channelTitle,
      channelImage: channelThumb,
    });
  }

  console.log(`enrolledkCourse post ${enrolledkCourse}`);
  res.json({ enrolledkCourse });
};

const getEnrolledCourseHandler = async (req, res) => {
  console.log("step 3");
  const { email } = req.body;
  let enrolledkCourse = await EnrolledkCourse.find({
    email,
  });

  // console.log(`google call ${email}`);

  console.log(`enrolledkCourse ${enrolledkCourse}`);
  res.json({ enrolledkCourse });
};

const deleteEnrolledCourseHandler = async (req, res) => {
  const { email, playlistId } = req.body;
  let deleteEnrolledCourseHandler = await EnrolledkCourse.findOneAndDelete({
    playlistId: playlistId,
    email,
  });

  console.log(`deleteEnrolledCourseHandler ${deleteEnrolledCourseHandler}`);
  res.json({ deleteEnrolledCourseHandler });
};

module.exports = {
  enrolledCourseHandler,
  getEnrolledCourseHandler,
  deleteEnrolledCourseHandler,
};
