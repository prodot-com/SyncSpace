import { Task } from "../Models/Task.model.js";
import { Workspace } from "../Models/Workspace.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, workspaceId } = req.body;

    const task = await Task.create({
      title,
      description,
      workspace: workspaceId,
    });

    await Workspace.findByIdAndUpdate(workspaceId, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const tasks = await Task.find({ workspace: workspaceId });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
