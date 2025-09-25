import { Notification } from '../models/Notification.model.js';


export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("sender", "name");
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // Ensure user owns the notification
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};