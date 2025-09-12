import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
