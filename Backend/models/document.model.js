import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true }, // path or cloud URL
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Document = mongoose.model("Document", documentSchema);
