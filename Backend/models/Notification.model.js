import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true,
    },
    link: { 
        type: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);