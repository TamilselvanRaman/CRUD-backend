const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../Controller/taskController");
const validateToken = require("../middelware/authMiddleware");
const { searchUserdetails } = require("../Controller/searchContoller");


const router = express.Router();
router.route("/").post(validateToken, createTask).get(validateToken, getTasks);
router
  .route("/:id")
  .put(validateToken, updateTask)
  .delete(validateToken, deleteTask);

router.route("/user/search/:username").get(validateToken, searchUserdetails);

module.exports = router;
