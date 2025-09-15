import { Task } from "../models/Task.model.js";

// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, status, workspace, assignedTo, dueDate } = req.body;
    const task = new Task({ title, description, status, workspace, assignedTo, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Tasks by Workspace
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workspace: req.params.workspaceId })
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createTask, getTasks, updateTask, deleteTask };
