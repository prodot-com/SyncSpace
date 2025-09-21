import express from "express";
import { Comment } from "../models/Comment.model.js";
import { Task } from "../models/Task.model.js";

const router = express.Router();

// --- Get all comments for a task ---
const getAllComments =  async (req, res) => {
    const { taskId } = req.params;
    try {
        const taskExists = await Task.findById(taskId);
        if (!taskExists) return res.status(404).json({ message: "Task not found" });

        const comments = await Comment.find({ task: taskId }).populate("user", "name email");
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};

// --- Add a comment to a task ---
const addComment =  async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) return res.status(400).json({ message: "Content cannot be empty" });

    try {
        const taskExists = await Task.findById(taskId);
        if (!taskExists) return res.status(404).json({ message: "Task not found" });

        const comment = new Comment({ task: taskId, user: userId, content });
        await comment.save();

        const populatedComment = await comment.populate("user", "name email");
        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add comment" });
    }
};


export {getAllComments, addComment}
