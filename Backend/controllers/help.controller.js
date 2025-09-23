import { HelpRequest } from "../models/HelpRequest.model.js";
import { Notification } from "../models/Notification.model.js";
import { Workspace } from "../models/Workspace.model.js";

export const createHelpRequest = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { message } = req.body;
        const userId = req.user._id;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const helpRequest = await HelpRequest.create({
            workspace: workspaceId,
            user: userId,
            message,
        });

        // --- NOTIFICATION LOGIC ---
        const notification = await Notification.create({
            user: workspace.createdBy, // Notify the admin
            sender: userId,
            message: `New help request from ${req.user.name} in workspace "${workspace.name}".`,
            link: `/admin` // Link to the admin page where they can see requests
        });
        const populatedNotification = await notification.populate('sender', 'name');

        const io = req.app.get('socketio');
        const onlineUsers = req.app.get('onlineUsers');
        const adminSocketId = onlineUsers[workspace.createdBy.toString()];

        if (adminSocketId) {
            io.to(adminSocketId).emit('new-notification', populatedNotification);
        }
        // --- END NOTIFICATION LOGIC ---

        res.status(201).json(helpRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ... existing getHelpRequests function ...
export const getHelpRequests = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await Workspace.findById(workspaceId);
        if (req.user._id.toString() !== workspace.createdBy.toString()) {
           return res.status(403).json({ message: "Not authorized" });
        }
        const requests = await HelpRequest.find({ workspace: workspaceId }).populate("user", "name email");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};