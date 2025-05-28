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
      channelTitle: channelTitle,
      channelImage: channelThumb,
    });
  }

  console.log(`enrolledkCourse ${enrolledkCourse}`);
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

module.exports = { enrolledCourseHandler, getEnrolledCourseHandler };
