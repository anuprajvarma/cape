const mongoose = require("mongoose");

const bookmarkCourseSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  thumbnail: {
    required: true,
    type: String,
  },
  playlistId: {
    required: true,
    type: String,
  },
  chapterLenth: {
    required: true,
    type: Number,
  },
  firstVideoId: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  channelTitle: {
    required: true,
    type: String,
  },
  channelImage: {
    required: true,
    type: String,
  },
});

const BookmarkCourse = mongoose.model("bookmarkCourse", bookmarkCourseSchema);

module.exports = BookmarkCourse;
