import { User } from '../models/User.model.js';
import { Workspace } from '../models/Workspace.model.js';
import { Task } from '../models/Task.model.js';

// Middleware to check if user is an admin
export const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

// @desc    Get application-wide statistics
// @route   GET /api/admin/stats
// @access  Admin
export const getAppStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const workspaceCount = await Workspace.countDocuments();
        const taskCount = await Task.countDocuments();

        res.json({
            users: userCount,
            workspaces: workspaceCount,
            tasks: taskCount,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({}).populate('createdBy', 'name email');
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete a workspace
// @route   DELETE /api/admin/workspaces/:id
// @access  Admin
export const deleteWorkspaceByAdmin = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (workspace) {
            // In a real app, you'd also delete associated tasks, docs, etc.
            await workspace.deleteOne();
            res.json({ message: 'Workspace removed' });
        } else {
            res.status(404).json({ message: 'Workspace not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
