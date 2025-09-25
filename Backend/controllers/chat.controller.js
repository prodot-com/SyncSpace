import { Chat } from "../models/Chat.model.js";


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
