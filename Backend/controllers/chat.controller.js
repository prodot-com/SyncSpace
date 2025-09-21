import { Chat } from "../models/Chat.model.js";

// @desc    Get all messages for a workspace
// @route   GET /api/chat/:workspaceId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const messages = await Chat.find({ workspace: workspaceId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 }); // Fetch in chronological order

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// This controller is for API, but message creation will be handled via Sockets.
// However, it's good practice to have an API endpoint as well.
// @desc    Create a new message
// @route   POST /api/chat/:workspaceId
// @access  Private
export const createMessage = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { content } = req.body;

        if(!content) return res.status(400).json({ message: "Content is required" });

        const message = await Chat.create({
            workspace: workspaceId,
            sender: req.user._id,
            content,
        });
        
        const populatedMessage = await message.populate("sender", "name email");

        res.status(201).json(populatedMessage);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}
