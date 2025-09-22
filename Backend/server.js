import 'dotenv/config';
import connect_db from "./src/db/Index.js";
import { app } from "./App.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Document } from './models/document.model.js';
import { Chat } from './models/Chat.model.js';
import { User } from './models/User.model.js';

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`App + Socket.IO listening at port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");
    if (!user) return next(new Error("Authentication error: User not found"));
    
    socket.user = user; // Attach user mongoose document to the socket
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`User ${socket.user._id} (${socket.user.name}) connected`);

  // --- Workspace & General Events ---
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(`workspace-${workspaceId}`);
    console.log(`User ${socket.user.name} joined workspace-${workspaceId}`);
  });

  // --- Chat Functionality ---
  socket.on("sendMessage", async ({ content, workspaceId }) => {
    if (!content || !workspaceId) return;
    try {
      // 1. Create and save the message to the database
      const message = await Chat.create({
        content,
        workspace: workspaceId,
        sender: socket.user._id,
      });

      // 2. The sender is the user object from the socket's handshake
      const finalMessage = {
          ...message.toObject(),
          sender: socket.user
      };

      // 3. Broadcast the complete message object to everyone in the workspace room
      io.to(`workspace-${workspaceId}`).emit("receiveMessage", finalMessage);

    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  // --- Real-time Document Editor Events ---
  socket.on("join-document", async (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.user.name} joined document ${documentId}`);
    
    try {
        const document = await Document.findById(documentId);
        if (document) {
            socket.emit("load-document", document.data);
        }
    } catch (error) {
        console.error("Error fetching document for joining user:", error);
    }
  });

  socket.on("send-changes", (delta, documentId) => {
    socket.broadcast.to(documentId).emit("receive-changes", delta);
  });

  socket.on("save-document", async ({ documentId, data }) => {
    try {
        await Document.findByIdAndUpdate(documentId, { data });
    } catch (error) {
        console.error("Error saving document:", error);
    }
  });

  // --- Other Events ---
  socket.on("taskUpdated", (task) => {
    if (task.workspace) {
        io.to(`workspace-${task.workspace}`).emit("taskUpdated", task);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.name} disconnected`);
  });
});

connect_db()
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log("MongoDB connection failed:", err));

