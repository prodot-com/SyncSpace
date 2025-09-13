import { Workspace } from "../models/Workspace.model.js";
import { User } from "../models/User.model.js";

// ✅ Create Workspace
const createWorkspace = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const workspace = new Workspace({
      name,
      description,
      createdBy: req.user._id,
      members: members && members.length > 0 ? members : [req.user._id],
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all Workspaces for logged-in user
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single Workspace by ID
const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Workspace
const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, description, members } = req.body;
    if (name) workspace.name = name;
    if (description) workspace.description = description;
    if (members) workspace.members = members;

    await workspace.save();
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Workspace
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workspace.deleteOne();
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add Member to Workspace
const addMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    const { userId } = req.body;

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!workspace.members.includes(userId)) {
      workspace.members.push(userId);
      await workspace.save();
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove Member from Workspace
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.members = workspace.members.filter(
      (member) => member.toString() !== userId
    );

    await workspace.save();
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export {
  createWorkspace,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
}