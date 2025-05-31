const Discussion = require("../models/discussion");

const discussoinHandler = async (req, res) => {
  const { playlistId, videoId, content, username, userImageUrl } = req.body;
  console.log(playlistId, videoId, content, username, userImageUrl);
  let discussion = await Discussion.findOneAndUpdate(
    {
      playlistId,
      videoId,
    },
    {
      $push: {
        discussions: { name: username, image: userImageUrl, content: content },
      },
    }
  );

  if (!discussion) {
    chat = await Discussion.create({
      playlistId,
      videoId,
      discussions: [{ name: username, image: userImageUrl, content: content }],
    });
  }

  console.log(`discussion ${discussion}`);

  res.json({ discussion });
};

const discussionGetDataHandler = async (req, res) => {
  const { playlistId, videoId } = req.body;
  console.log(playlistId, videoId);
  const discussionData = await Discussion.findOne({
    playlistId,
    videoId,
  });

  // console.log(`getChapterData ${getChapterData}`);
  res.json({ discussionData });
};

module.exports = {
  discussoinHandler,
  discussionGetDataHandler,
};
