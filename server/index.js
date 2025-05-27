const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./router/auth");
const enrolledCourseRoute = require("./router/enrolledCourse");
const dbConnection = require("./connection/dbConnection");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow Next.js frontend to access this API
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

dbConnection(
  "mongodb+srv://anupraj1854:4q8qzWNOm5uOi3BG@cap-cluster.akv8zrp.mongodb.net/?retryWrites=true&w=majority&appName=cap-cluster"
);

app.use("/api/auth", authRoute);
app.use("/api/enrolledCourse", enrolledCourseRoute);

app.listen(process.env.PORT, () =>
  console.log(`server is started on ${process.env.PORT}`)
);
