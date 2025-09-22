import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String }, // optional now
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isTextDocument: { type: Boolean, default: false }, // distinguish between file & text docs
  data: { type: Object }, // Quill JSON (for text docs)
  createdAt: { type: Date, default: Date.now }
});

export const Document = mongoose.model("Document", documentSchema);
