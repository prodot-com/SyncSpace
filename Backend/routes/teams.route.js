import express from "express";
import { createTeam,getTeamById,getTeams, updateTeam,deleteTeam,addMember,removeMember } from "../controllers/team.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);

router.route("/:id")
  .get(protect, getTeamById)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

router.route("/:id/members")
  .post(protect, addMember);

router.route("/:id/members/:userId")
  .delete(protect, removeMember);

export default router;
