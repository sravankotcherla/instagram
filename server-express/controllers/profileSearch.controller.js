const { User } = require("../models/user.model");

exports.getSearchResults = (req, res) => {
  const searchString = req.query.searchText;
  const regexPattern = new RegExp(
    searchString || req.query.searchText || "sra",
    "i"
  );

  User.aggregate([
    {
      $match: {
        $or: [
          { username: { $regex: regexPattern } },
          { name: { $regex: regexPattern } },
        ],
      },
    },
  ])
    .then((users) => {
      return res.jsonp(users);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "Failed to fetch search results", error: err });
    });
};
