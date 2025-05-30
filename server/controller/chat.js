const Chat = require("../models/chat");

const chatHandler = async (req, res) => {
  const { email, playlistId, question, answer } = req.body;
  console.log(email, playlistId, question, answer);
  let chat = await Chat.findOneAndUpdate(
    {
      email,
      playlistId,
    },
    { $addToSet: { chats: { question, answer } } }
  );

  if (!chat) {
    chat = await Chat.create({
      email,
      playlistId,
      chats: [{ question, answer }],
    });
  }

  console.log(`chat ${chat}`);

  res.json({ chat });
};

const chatDataGet = async (req, res) => {
  const { email, playlistId } = req.body;
  // console.log(email, playlistId);
  const chatData = await Chat.findOne({
    playlistId,
    email,
  });

  // console.log(`getChapterData ${getChapterData}`);
  res.json({ chatData });
};

module.exports = {
  chatHandler,
  chatDataGet,
};
