const UserScore = require("../models/score");

const addUserScoreHandler = async (req, res) => {
  const { videoId, playlistId, email, score } = req.body;
  console.log(`videoid ${videoId} ${playlistId} ${email} ${score}`);
  const userScoreExist = await UserScore.findOne({
    videoId: videoId,
    playlistId: playlistId,
    email: email,
  });

  console.log(`userScoreExist ${userScoreExist}`);

  if (userScoreExist === null || userScoreExist === 0) {
    console.log("userScoreExist is null");
    const userScore = await UserScore.create({
      videoId: videoId,
      playlistId: playlistId,
      email: email,
      score: score,
    });
    res.json({ userScore });
  }
};

const getUserScoreHandler = async (req, res) => {
  const { videoId, playlistId, email } = req.body;
  const userScore = await UserScore.findOne({
    videoId: videoId,
    playlistId: playlistId,
    email: email,
  });
  console.log(`userScore ${userScore}`);
  res.json({ userScore });
};

module.exports = { addUserScoreHandler, getUserScoreHandler };
