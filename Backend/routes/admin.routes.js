import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
    checkAdmin,
    getAppStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllWorkspaces,
    updateWorkspace,
    deleteWorkspace,
    getAllTasks,
    updateTask,
    deleteTask,
    getAllHelpRequests, 
    resolveHelpRequest
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(protect, checkAdmin);

// --- Dashboard Stats ---
router.get('/stats', getAppStats);

// --- User Management ---
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// --- Workspace Management ---
router.get('/workspaces', getAllWorkspaces);
router.put('/workspaces/:id', updateWorkspace);
router.delete('/workspaces/:id', deleteWorkspace);

// --- Task Management ---
router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.get('/help-requests', getAllHelpRequests);
router.delete('/help-requests/:id', resolveHelpRequest);

export default router;

