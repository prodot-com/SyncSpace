import express from 'express';
import protect from '../middleware/auth.middleware.js';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;