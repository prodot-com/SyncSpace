import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { // The user who RECEIVES the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sender: { // The user who TRIGGERED the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true,
    },
    link: { // A URL to the relevant item (e.g., a task or workspace)
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);