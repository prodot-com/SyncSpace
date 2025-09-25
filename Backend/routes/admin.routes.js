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


router.use(protect, checkAdmin);
router.get('/stats', getAppStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/workspaces', getAllWorkspaces);
router.put('/workspaces/:id', updateWorkspace);
router.delete('/workspaces/:id', deleteWorkspace);
router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.get('/help-requests', getAllHelpRequests);
router.delete('/help-requests/:id', resolveHelpRequest);

export default router;

