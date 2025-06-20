const Searchs = require("../models/search");

const searchHandler = async (req, res) => {
  const { title } = req.body;
  console.log(`title ${title}`);
  const searchData = await Searchs.find({});

  if (searchData === null || searchData.length === 0) {
    const search = await Searchs.create({
      title: [title],
    });
    console.log(`search ${search}`);
    res.json({ search });
  } else {
    const searchUpdate = await Searchs.findOneAndUpdate(
      {},
      { $addToSet: { title: title } }
    );
    console.log(`searchUpdate ${searchUpdate}`);
  }
};

const getSearchDataHandler = async (req, res) => {
  const searchData = await Searchs.find({});
  console.log(`searchData ${searchData}`);
  res.json({ searchData });
};

module.exports = { searchHandler, getSearchDataHandler };
