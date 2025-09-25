import { Team } from "../Models/Team.models.js";
import { User } from "../models/User.model.js";


export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    
    const team = await Team.create({
      name,
      members: [req.user._id],
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
