import { Task } from "../models/Task.model.js";
import { Notification } from "../models/Notification.model.js";
import { Workspace } from "../models/Workspace.model.js";

const notifyUser = async (req, userToNotifyId, message, link) => {
  if (userToNotifyId.toString() === req.user._id.toString()) return;

  const notification = await Notification.create({
    user: userToNotifyId,
    sender: req.user._id,
    message,
    link,
  });

  const populatedNotification = await notification.populate("sender", "name");

  const io = req.app.get("socketio");
  const onlineUsers = req.app.get("onlineUsers");
  const recipientSocketId = onlineUsers[userToNotifyId.toString()];

  if (recipientSocketId) {
    io.to(recipientSocketId).emit("new-notification", populatedNotification);
  }
};


const createTask = async (req, res) => {
  try {
    const { title, description, status, workspace, assignedTo, dueDate } = req.body;

    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc) return res.status(404).json({ message: "Workspace not found" });

    const task = new Task({ title, description, status, workspace, assignedTo, dueDate });
    await task.save();

  
    if (assignedTo) {
      await notifyUser(
        req,
        assignedTo,
        `You were assigned a new task "${title}" in workspace "${workspaceDoc.name}".`,
        `/workspace/${workspace}/tasks`
      );
    }
    

    const populatedTask = await task.populate("assignedTo", "name email");
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workspace: req.params.workspaceId }).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!task) return res.status(404).json({ message: "Task not found" });
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      "assignedTo",
      "name email"
    );


    if (
      updatedTask.assignedTo &&
      req.body.status &&
      req.body.status !== oldTask.status
    ) {
      await notifyUser(
        req,
        updatedTask.assignedTo._id,
        `Task "${updatedTask.title}" status was updated to "${updatedTask.status}".`,
        `/workspace/${updatedTask.workspace}/tasks`
      );
    }

    
    if (
      updatedTask.assignedTo &&
      oldTask.assignedTo?.toString() !== updatedTask.assignedTo._id.toString()
    ) {
      await notifyUser(
        req,
        updatedTask.assignedTo._id,
        `You have been assigned to task "${updatedTask.title}".`,
        `/workspace/${updatedTask.workspace}/tasks`
      );
    }
    

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



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
