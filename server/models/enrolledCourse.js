const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
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
  playlistDescription: {
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

const EnrolledkCourse = mongoose.model("enrolledkCourse", enrolledCourseSchema);

module.exports = EnrolledkCourse;
