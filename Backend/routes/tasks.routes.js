import express from "express";
import { createTask, updateTaskStatus, getTasks } from "../controllers/task.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.patch("/:taskId/status", protect, updateTaskStatus);
router.get("/:workspaceId", protect, getTasks);

export default router;
