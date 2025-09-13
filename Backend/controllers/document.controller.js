import { Document } from "../models/document.model.js";

// ✅ Create Document
const createDocument = async (req, res) => {
  try {
    const { title, workspace, collaborators } = req.body;
    const doc = new Document({ title, workspace, collaborators });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Documents by Workspace
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ workspace: req.params.workspaceId });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Document (e.g., rename, add collaborators)
const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Document
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
    deleteDocument,
    updateDocument,
    createDocument,
    getDocuments
}