const EnrolledkCourse = require("../models/enrolledCourse");

const enrolledCourseHandler = async (req, res) => {
  const {
    title,
    channelTitle,
    thumbnails,
    length,
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

  if (enrolledkCourse) {
    console.log(`find course enrolledcourse ${enrolledkCourse}`);
    res.json({ enrolledkCourse, isExist: true });
  }

  if (!enrolledkCourse) {
    enrolledkCourse = await EnrolledkCourse.create({
      email: email,
      thumbnail: thumbnails,
      playlistId: id,
      playlistDescription: description,
      chapterLength: length,
      firstVideoId: firstVideoId,
      title: title,
      bookmark: bookmark,
      chapters: [],
      channelTitle: channelTitle,
      channelImage: channelThumb,
    });
    console.log(`create course enrolledcourse ${enrolledkCourse}`);
    res.json({ enrolledkCourse, isExist: false });
  }
};

const getEnrolledCourseHandler = async (req, res) => {
  //   console.log("step 3");
  const { email } = req.body;
  let enrolledkCourse = await EnrolledkCourse.find({
    email,
  });

  // console.log(`google call ${email}`);

  //   console.log(`enrolledkCourse ${enrolledkCourse}`);
  res.json({ enrolledkCourse });
};

const appChapterHandler = async (req, res) => {
  const { email, playlistId, videoId } = req.body;
  //   console.log(email, playlistId, videoId);
  let appChapterHandler = await EnrolledkCourse.findOneAndUpdate(
    {
      email,
      playlistId,
    },
    { $addToSet: { chapters: videoId } }
  );

  // console.log(`appChapterHandler ${appChapterHandler}`);
  res.json({ appChapterHandler });
};

const removeChapterHandler = async (req, res) => {
  const { email, playlistId, videoId } = req.body;
  let removeChapterHandler = await EnrolledkCourse.findOneAndUpdate(
    {
      email,
      playlistId,
    },
    { $pull: { chapters: videoId } }
  );

  // console.log(`removeChapterHandler ${removeChapterHandler}`);
  res.json({ removeChapterHandler });
};

const getChapterData = async (req, res) => {
  const { email, playlistId } = req.body;
  // console.log(email, playlistId);
  const getChapterData = await EnrolledkCourse.findOne({
    playlistId: playlistId,
    email,
  });

  // console.log(`getChapterData ${getChapterData}`);
  res.json({ getChapterData });
};

const deleteEnrolledCourseHandler = async (req, res) => {
  const { email, playlistId } = req.body;
  let deleteEnrolledCourseHandler = await EnrolledkCourse.findOneAndDelete({
    playlistId: playlistId,
    email,
  });

  // console.log(`deleteEnrolledCourseHandler ${deleteEnrolledCourseHandler}`);
  res.json({ deleteEnrolledCourseHandler });
};

module.exports = {
  enrolledCourseHandler,
  getEnrolledCourseHandler,
  deleteEnrolledCourseHandler,
  appChapterHandler,
  removeChapterHandler,
  getChapterData,
};
