import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { checkAdmin, getAppStats, getAllUsers, deleteUser, updateUserRole, getAllWorkspaces, deleteWorkspaceByAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

// All routes in this file are protected and require admin privileges

router.get("/stats", protect, checkAdmin, getAppStats);
router.get("/users", protect, checkAdmin, getAllUsers);
router.delete("/users/:id", protect, checkAdmin, deleteUser);
router.put("/users/:id/role", protect, checkAdmin, updateUserRole);
router.get("/workspaces", protect, checkAdmin, getAllWorkspaces);
router.delete("/workspaces/:id", protect, checkAdmin, deleteWorkspaceByAdmin);


export default router;
