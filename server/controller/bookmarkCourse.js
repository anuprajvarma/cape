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
    bookmark,
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
      bookmark: bookmark,
    });
  }

  // console.log(`bookmark ${enrolledkCourse}`);
  res.json({ bookmarkCourse });
};

const getBookmarCourseHandler = async (req, res) => {
  // console.log("step 3");
  const { email } = req.body;
  let bookmarkCourse = await BookmarkCourse.find({
    email,
  });

  // console.log(`google call ${email}`);

  // console.log(`bookmarkCourse ${bookmarkCourse}`);
  res.json({ bookmarkCourse });
};

const deleteBookmarCourseHandler = async (req, res) => {
  const { email, id } = req.body;
  let deleteBookmarCourseHandler = await BookmarkCourse.findOneAndDelete({
    playlistId: id,
    email,
  });

  // console.log(`google call ${email}`);

  // console.log(`deleteBookmarCourseHandler ${deleteBookmarCourseHandler}`);
  res.json({ deleteBookmarCourseHandler });
};

module.exports = {
  bookmarCourseHandler,
  getBookmarCourseHandler,
  deleteBookmarCourseHandler,
};
