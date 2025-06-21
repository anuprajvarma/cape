const Notes = require("../models/notes");

const addNoteHandler = async (req, res) => {
  const { email, playlistId, content } = req.body;
  // console.log(`content ${content}`);
  // console.log(email, playlistId, content);
  let note = await Notes.findOneAndUpdate(
    {
      email,
      playlistId,
    },
    { content }
  );

  if (!note) {
    chat = await Notes.create({
      email,
      playlistId,
      content,
    });
  }

  // console.log(`note ${note}`);

  res.json({ note });
};

const getNoteHandler = async (req, res) => {
  // console.log("getnote");
  const { email, playlistId } = req.body;
  // console.log(email, playlistId);
  const noteData = await Notes.findOne({
    playlistId,
    email,
  });

  // console.log(`getChapterData ${getChapterData}`);
  res.json({ noteData });
};

module.exports = {
  addNoteHandler,
  getNoteHandler,
};
