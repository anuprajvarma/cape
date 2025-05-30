const Notes = require("../models/notes");

const addNoteHandler = async (req, res) => {
  const { email, playlistId, videoId, content } = req.body;
  console.log("addNote");
  console.log(email, playlistId, videoId, content);
  let note = await Notes.findOneAndUpdate(
    {
      email,
      playlistId,
      videoId,
    },
    { content }
  );

  if (!note) {
    chat = await Notes.create({
      email,
      playlistId,
      videoId,
      content,
    });
  }

  console.log(`note ${note}`);

  res.json({ note });
};

const getNoteHandler = async (req, res) => {
  console.log("getnote");
  const { email, playlistId, videoId } = req.body;
  console.log(email, playlistId, videoId);
  const noteData = await Notes.findOne({
    playlistId,
    email,
    videoId,
  });

  // console.log(`getChapterData ${getChapterData}`);
  res.json({ noteData });
};

module.exports = {
  addNoteHandler,
  getNoteHandler,
};
