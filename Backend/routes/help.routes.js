import express from "express";
import { createHelpRequest, getHelpRequests } from "../controllers/help.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:workspaceId")
    .post(protect, createHelpRequest)
    .get(protect, getHelpRequests);

export default router;
