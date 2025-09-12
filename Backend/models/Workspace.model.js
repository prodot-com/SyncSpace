import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true });

export const Workspace = mongoose.model("Workspace", workspaceSchema);
