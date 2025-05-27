const express = require("express");
const { googleAuthHandle, handleSignout } = require("../controller/auth");

const router = express.Router();

router.post("/login", googleAuthHandle);

router.post("/signout", handleSignout);

module.exports = router;
