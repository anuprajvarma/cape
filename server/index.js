const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./router/auth");
const enrolledCourseRoute = require("./router/enrolledCourse");
const bookmarkCourseRoute = require("./router/bookmarkCourse");
const chat = require("./router/chat");
const notes = require("./router/notes");
const searchRoute = require("./router/search");
const discussionRoute = require("./router/discussion");
const dbConnection = require("./connection/dbConnection");

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN, // Allow Next.js frontend to access this API
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

dbConnection(process.env.MONGOURI);

app.use("/api/auth", authRoute);
app.use("/api/enrolledCourse", enrolledCourseRoute);
app.use("/api/bookmarkCourse", bookmarkCourseRoute);
app.use("/api/chat", chat);
app.use("/api/notes", notes);
app.use("/api/discussion", discussionRoute);
app.use("/api/searchs", searchRoute);

app.listen(process.env.PORT, () =>
  console.log(`server is started on ${process.env.PORT}`)
);
