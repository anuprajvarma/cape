const Quizz = require("../models/quizz");

const addQuizzHandler = async (req, res) => {
  const { videoId, playlistId, quizz } = req.body;
  //   console.log(`videoid ${videoId} ${playlistId} ${quizz}`);
  const quizzData = await Quizz.find({
    videoId: videoId,
    playlistId: playlistId,
  });

  //   console.log(`quizzData ${quizzData}`);

  if (quizzData === null || quizzData.length === 0) {
    // console.log("quizzData is null");
    const quizzCreate = await Quizz.create({
      videoId: videoId,
      playlistId: playlistId,
      quizz: quizz,
    });
    res.json({ quizzCreate });
  }
};

const getQuizzDataHandler = async (req, res) => {
  const { videoId, playlistId } = req.body;
  const quizzData = await Quizz.find({
    videoId: videoId,
    playlistId: playlistId,
  });
  //   console.log(`quizzData ${quizzData}`);
  res.json({ quizzData });
};

module.exports = { addQuizzHandler, getQuizzDataHandler };
