import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved'],
        default: 'Open',
    },
}, { timestamps: true });

export const HelpRequest = mongoose.model("HelpRequest", helpRequestSchema);
