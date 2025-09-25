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


const onlineUsers = {};
app.set('onlineUsers', onlineUsers);
app.set('socketio', io);


io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email role");
    if (!user) return next(new Error("Authentication error: User not found"));
    
    socket.user = user; 
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});


io.on("connection", (socket) => {
  console.log(`User ${socket.user.name} connected with socket ID ${socket.id}`);
  
 
  onlineUsers[socket.user._id.toString()] = socket.id;

  
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(`workspace-${workspaceId}`);
    console.log(`User ${socket.user.name} joined workspace-${workspaceId}`);
  });

  
  socket.on("sendMessage", async ({ content, workspaceId }) => {
    if (!content || !workspaceId) return;
    try {
      const message = await Chat.create({
        content,
        workspace: workspaceId,
        sender: socket.user._id
      });
      
      const populatedMessage = { ...message.toObject(), sender: socket.user };
      io.to(`workspace-${workspaceId}`).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  
  socket.on("join-document", async (documentId) => {
    socket.join(documentId);
    try {
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit("load-document", document.data);
      }
    } catch (err) {
      console.error("Error loading document:", err);
    }
  });

  socket.on("send-changes", (delta, documentId) => {
    socket.to(documentId).emit("receive-changes", delta);
  });

  socket.on("save-document", async ({ documentId, data }) => {
    try {
      await Document.findByIdAndUpdate(documentId, { data });
    } catch (err) {
      console.error("Error saving document:", err);
    }
  });

  
  socket.on("taskUpdated", (task) => {
    if (task.workspace) {
      io.to(`workspace-${task.workspace}`).emit("taskUpdated", task);
    }
  });
  
  socket.on("docUpdated", (payload) => {
    if (payload.workspaceId) {
      io.to(`workspace-${payload.workspaceId}`).emit("docUpdated", payload);
    }
  });

  
  socket.on("disconnect", () => {
    console.log(`User ${socket.user.name} disconnected`);
    delete onlineUsers[socket.user._id.toString()];
  });
});


connect_db()
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection failed:", err));

