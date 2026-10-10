const BookmarkCourse = require("../models/bookmarkCourse");

const bookmarCourseHandler = async (req, res) => {
  const { title, channelTitle, thumbnails, id, bookmark, email } = req.body;
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
      title: title,
      channelTitle: channelTitle,
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
  res.json({ bookmarkCourse });
};

const deleteBookmarCourseHandler = async (req, res) => {
  const { email, id } = req.body;
  let deleteBookmarCourseHandler = await BookmarkCourse.findOneAndDelete({
    playlistId: id,
    email,
  });
  res.json({ deleteBookmarCourseHandler });
};

module.exports = {
  bookmarCourseHandler,
  getBookmarCourseHandler,
  deleteBookmarCourseHandler,
};
