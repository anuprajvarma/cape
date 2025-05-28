const BookmarkCourse = require("../models/bookmarkCourse");

const bookmarCourseHandler = async (req, res) => {
  console.log("bookmark");
  const {
    title,
    channelTitle,
    thumbnails,
    lenth,
    channelThumb,
    id,
    firstVideoId,
    email,
  } = req.body;
  let bookmarkCourse = await BookmarkCourse.findOne({
    playlistId: id,
    email,
  });

  if (!bookmarkCourse) {
    bookmarkCourse = await BookmarkCourse.create({
      email: email,
      thumbnail: thumbnails,
      playlistId: id,
      chapterLenth: lenth,
      firstVideoId: firstVideoId,
      title: title,
      channelTitle: channelTitle,
      channelImage: channelThumb,
    });
  }

  console.log(`bookmark ${enrolledkCourse}`);
  res.json({ bookmarkCourse });
};

const getBookmarCourseHandler = async (req, res) => {
  console.log("step 3");
  const { email } = req.body;
  let bookmarkCourse = await BookmarkCourse.find({
    email,
  });

  // console.log(`google call ${email}`);

  console.log(`bookmarkCourse ${bookmarkCourse}`);
  res.json({ bookmarkCourse });
};

module.exports = { bookmarCourseHandler, getBookmarCourseHandler };
