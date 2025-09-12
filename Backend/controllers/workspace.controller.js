import { Workspace } from "../Models/Workspace.model.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, teamId } = req.body;
    const workspace = await Workspace.create({ name, team: teamId });

    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const { teamId } = req.query;
    const workspaces = await Workspace.find({ team: teamId }).populate("tasks");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
