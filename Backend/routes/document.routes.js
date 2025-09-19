import express from "express";
import multer from "multer";
import { uploadDocument, getDocuments, deleteDocument } from "../controllers/document.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

// multer storage (local disk)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post("/:workspaceId", protect, upload.single("file"), uploadDocument);
router.get("/:workspaceId", protect, getDocuments);
router.delete("/:id", protect, deleteDocument);

export default router;
