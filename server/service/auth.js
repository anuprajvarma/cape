// session based authentication

// const userSessionData = new Map();

// const setUser = (id, user) => {
//   userSessionData.set(id, user);
// };

// const getUser = (id) => {
//   const user = userSessionData.get(id);
//   return user;
// };

// const deleteUser = (id) => {
//   userSessionData.delete(id);
// };

// const checkUser = (id) => {
//   const user = userSessionData.has(id);
//   return user;
// };

// module.exports = { setUser, getUser, deleteUser, checkUser };

// token based authentication

const jwt = require("jsonwebtoken");
const secret = "anuprajvarma";

const setUser = (user) => {
  // console.log(user);
  const token = jwt.sign(
    {
      _id: user._id,
      imageUrl: user.imageUrl,
      email: user.email,
      name: user.name,
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const getUser = (token) => {
  if (!token) return null;
  try {
    const user = jwt.verify(token, secret);
    if (!user) return null;
    return user;
  } catch (error) {
    console.log("error getting user");
  }
};

module.exports = { setUser, getUser };
