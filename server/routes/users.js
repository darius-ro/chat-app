var express = require("express"),
  router = express.Router();

var users = require("../models/users");

router.get("/:_id", async (req, res) => {
  const params = req.params;
  const _id = params._id;
  if (!_id)
    return res.status(400).json({
      error: "Missing _id query.",
    });

  try {
    const user = await users.findOne({ _id }).select("username");

    if (!user)
      return res.status(404).json({
        error: "User does not exist!",
      });

    return res.status(200).json({
      error: false,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: "A unexpected error has occured.",
    });
  }
});

module.exports = router;
