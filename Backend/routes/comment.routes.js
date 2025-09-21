import express from "express";
import protect from "../middleware/auth.middleware.js"
import { getAllComments, addComment } from "../controllers/comment.controller.js";
const router = express.Router();

router.get('/:taskId', protect, getAllComments)
router.post('/:taskId',protect, addComment)

export default router;