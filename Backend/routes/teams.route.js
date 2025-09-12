import express from "express";
import { createTeam, addMember } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.post("/:teamId/add-member", protect, addMember);

export default router;
