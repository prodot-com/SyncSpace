import { Document } from "../models/document.model.js";
import { Workspace } from "../models/Workspace.model.js";

export const uploadDocument = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await Document.create({
      name: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      workspace: workspaceId,
      uploadedBy: req.user._id
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const docs = await Document.find({ workspace: workspaceId }).populate("uploadedBy", "name email");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
