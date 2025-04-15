const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

const searchUserdetails = asyncHandler(async (req, res) => {
  const title  = req.params.username;

  if (!title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await Task.findOne({ title });

  if (userExists) {
    return res.status(200).json({ userExists });
  } else {
    return res.status(404).json({ message: "Title Not Found!" });
  }
});

module.exports = { searchUserdetails };
