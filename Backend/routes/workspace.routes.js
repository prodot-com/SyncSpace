import express from "express";
import protect from "../middleware/auth.middleware.js";
import {createWorkspace,getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember } from "../controllers/workspace.controller.js"

const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);
router.get("/:id", protect, getWorkspaceById);
router.put("/:id", protect, updateWorkspace);
router.delete("/:id", protect, deleteWorkspace);

router.post("/:id/members", protect, addMember);
router.delete("/:id/members/:userId", protect, removeMember);

export default router;
