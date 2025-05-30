const express = require("express");
const { getNoteHandler, addNoteHandler } = require("../controller/notes");

const router = express.Router();

router.post("/getNote", getNoteHandler);
// router.post("/updateNote", updateNoteHandler);
router.post("/addNote", addNoteHandler);
// router.post("/deleteNote", deleteNoteHandler);

module.exports = router;
