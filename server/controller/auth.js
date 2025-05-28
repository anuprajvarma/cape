const User = require("../models/user");
const { setUser } = require("../service/auth");

const handleSignout = async (req, res) => {
  res.clearCookie("uid", {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax", // or "none" with secure: true if cross-site
  });
  res.json({ success: true, redirectTo: "/login" });
};

const googleAuthHandle = async (req, res) => {
  const { name, email, imageUrl } = req.body;
  let user = await User.findOne({ email });

  // console.log(`google call ${email}`);

  if (!user) {
    user = await User.create({ name, email, imageUrl, provider: "google" });
  }

  const token = setUser(user);
  //   console.log(`token ${token}`);
  //   console.log(`user ${user}`);
  res.cookie("uid", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax", // or "none" with secure: true if cross-site
  });
  res.json({ user, redirectTo: "/" });
};

module.exports = { googleAuthHandle, handleSignout };
