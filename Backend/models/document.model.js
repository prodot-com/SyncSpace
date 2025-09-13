import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
