import express from "express";
import { getMessages, createMessage } from "../controllers/chat.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:workspaceId")
    .get(protect, getMessages)
    .post(protect, createMessage);

export default router;
