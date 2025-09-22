import { Document } from "../models/document.model.js";
import { Workspace } from "../models/Workspace.model.js";

export const uploadDocument = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    console.log("uploadDocument")
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

export const createTextDocument = async (req, res) => {
  try {
    const { title, workspaceId } = req.body;
    console.log("createTextDocument")

    if (!title || !workspaceId) {
      return res.status(400).json({ message: "Title and workspace are required." });
    }

    const document = await Document.create({
      name: title,
      workspace: workspaceId,
      uploadedBy: req.user._id,
      isTextDocument: true,
      data: { ops: [{ insert: '\n' }] } // Default Quill blank
    });

    res.status(201).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
