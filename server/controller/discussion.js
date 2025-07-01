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

const discussionDeleteHandler = async (req, res) => {
  const { playlistId, videoId, name, content } = req.body;
  console.log(playlistId, videoId, name, content);
  const deleteDiscussion = await Discussion.findOneAndUpdate(
    {
      playlistId,
      videoId,
    },
    {
      $pull: {
        discussions: {
          name,
          content,
        },
      },
    }
  );
  res.json({ deleteDiscussion });
};

module.exports = {
  discussoinHandler,
  discussionGetDataHandler,
  discussionDeleteHandler,
};
