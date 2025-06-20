const express = require("express");
const { searchHandler, getSearchDataHandler } = require("../controller/search");

const router = express.Router();

router.post("/", searchHandler);
router.get("/getData", getSearchDataHandler);

module.exports = router;
