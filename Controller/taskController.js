const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "End date must be after start date" });
  }

  const newTask = await Task.create({ title, description, startDate, endDate, user: req.user.id });
  res.status(201).json({ message: "Task created successfully", task: newTask });
});

// Get Tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Task updated successfully", task: updatedTask });
});

// Delete Task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  await task.deleteOne();
  res.status(200).json({ message: "Task deleted successfully" });
});

module.exports = { createTask, getTasks, updateTask, deleteTask };
