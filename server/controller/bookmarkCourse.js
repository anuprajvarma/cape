const BookmarkCourse = require("../models/bookmarkCourse");

const bookmarCourseHandler = async (req, res) => {
  console.log("bookmark");
  const {
    title,
    channelTitle,
    thumbnails,
    length,
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

  if (bookmarkCourse) {
    res.json({ bookmarkCourse, isExist: true });
  }

  if (!bookmarkCourse) {
    bookmarkCourse = await BookmarkCourse.create({
      email: email,
      thumbnail: thumbnails,
      playlistId: id,
      chapterLength: length,
      firstVideoId: firstVideoId,
      title: title,
      channelTitle: channelTitle,
      channelImage: channelThumb,
      bookmark: bookmark,
    });
  }

  res.json({ bookmarkCourse, isExist: false });
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
