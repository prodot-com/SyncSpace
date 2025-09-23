import { Task } from "../models/Task.model.js";

const notifyUser = async (req, userToNotifyId, message, link) => {
    if (userToNotifyId.toString() === req.user._id.toString()) return; // Don't notify user about their own actions

    const notification = await Notification.create({
        user: userToNotifyId,
        sender: req.user._id,
        message,
        link
    });

    const populatedNotification = await notification.populate('sender', 'name');

    const io = req.app.get('socketio');
    const onlineUsers = req.app.get('onlineUsers');
    const recipientSocketId = onlineUsers[userToNotifyId.toString()];

    if (recipientSocketId) {
        io.to(recipientSocketId).emit('new-notification', populatedNotification);
    }
};

// ✅ Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, status, workspace, assignedTo, dueDate } = req.body;
        const task = new Task({ title, description, status, workspace, assignedTo, dueDate });
        await task.save();

        // --- NOTIFICATION LOGIC ---
        if (assignedTo) {
            await notifyUser(
                req,
                assignedTo,
                `${req.user.name} assigned you a new task: "${title}"`,
                `/workspace/${workspace}`
            );
        }
        // --- END NOTIFICATION LOGIC ---

        const populatedTask = await task.populate('assignedTo', 'name email');
        res.status(201).json(populatedTask);
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
