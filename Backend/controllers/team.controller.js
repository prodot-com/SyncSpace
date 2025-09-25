import { Team } from "../Models/Team.models.js";
import { User } from "../models/User.model.js";


const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = new Team({
      name,
      description,
      members: members || [req.user._id], 
    });

    await team.save();
    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "-password");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("members", "-password");
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.name = name || team.name;
    team.description = description || team.description;
    if (members) team.members = members;

    await team.save();
    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.deleteOne();
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    res.json({ message: "Member added successfully", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: "User not in team" });
    }

    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    res.json({ message: "Member removed successfully", team });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
};
