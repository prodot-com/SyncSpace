import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createDocument, getDocuments, updateDocument, deleteDocument } from "../controllers/document.controller.js";

const router = express.Router();

router.post("/", protect, createDocument);
router.get("/:workspaceId", protect, getDocuments);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;
