import express from "express";
import multer from "multer";
import { uploadDocument, getDocuments, deleteDocument,createTextDocument, getDocumentById } from "../controllers/document.controller.js";
import protect from "../middleware/auth.middleware.js"

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });


router.post("/text", protect, createTextDocument);
router.get("/doc/:id", protect, getDocumentById);
router.post("/:workspaceId", protect, upload.single("file"), uploadDocument);
router.get("/:workspaceId", protect, getDocuments);
router.delete("/:id", protect, deleteDocument);


export default router;
