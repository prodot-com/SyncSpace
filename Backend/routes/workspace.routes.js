import express from "express";
import { createWorkspace, getWorkspaces } from "../controllers/workspace.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);

export default router;
