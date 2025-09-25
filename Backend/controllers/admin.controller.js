import { User } from '../models/User.model.js';
import { Workspace } from '../models/Workspace.model.js';
import { Task } from '../models/Task.model.js';
import { HelpRequest } from '../models/HelpRequest.model.js';


export const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};


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


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'Admin' && user._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Cannot delete other admin accounts.' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({}).populate('createdBy', 'name email').populate('members', 'name');
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateWorkspace = async(req, res) => {
    try {
        const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('createdBy', 'name email').populate('members', 'name');
        if(!workspace) return res.status(404).json({ message: "Workspace not found" });
        res.json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (workspace) {
            await workspace.deleteOne();
            // Also delete associated tasks, docs etc.
            await Task.deleteMany({ workspace: req.params.id });
            res.json({ message: 'Workspace removed' });
        } else {
            res.status(404).json({ message: 'Workspace not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('workspace', 'name').populate('assignedTo', 'name');
        res.json(tasks);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('workspace', 'name')
            .populate('assignedTo', 'name');
            
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

export const getAllHelpRequests = async (req, res) => {
    try {
        const requests = await HelpRequest.find({})
            .populate('user', 'name email')
            .populate('workspace', 'name')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message)
    }
};


export const resolveHelpRequest = async (req, res) => {
    try {
        const request = await HelpRequest.findById(req.params.id);
        if (request) {
            await request.deleteOne();
            res.json({ message: 'Help request resolved' });
        } else {
            res.status(404).json({ message: 'Help request not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

