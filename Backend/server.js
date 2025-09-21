import 'dotenv/config';
import connect_db from "./src/db/Index.js";
import { app } from "./App.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`App + Socket.IO listening at port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
    ],
    credentials: true,
  },
});

// Socket auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Just a base socket event for now
io.on("connection", (socket) => {
  console.log(`User ${socket.user.id} connected`);

  // ✅ Join Workspace Room
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(`workspace-${workspaceId}`);
    console.log(`User ${socket.user.id} joined workspace-${workspaceId}`);
  });

  // ✅ Chat Messages
  socket.on("sendMessage", ({ content, workspaceId }) => {
    const message = {
      content,
      workspaceId,
      sender: {
        _id: socket.user.id,
        name: socket.user.name || "Unknown User",
      },
      createdAt: new Date(),
    };

    io.to(`workspace-${workspaceId}`).emit("receiveMessage", message);
  });

  // ✅ Kanban Updates
  socket.on("taskUpdated", (task) => {
    io.to(`workspace-${task.workspace}`).emit("taskUpdated", task);
  });

  // ✅ Document Updates
  socket.on("docUpdated", ({ docId, content }) => {
    io.to(`doc-${docId}`).emit("docUpdated", { docId, content });
  });

  socket.on("joinDoc", (docId) => {
    socket.join(`doc-${docId}`);
    console.log(`User ${socket.user.id} joined doc-${docId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});



connect_db()
  .then(() => console.log())
  .catch((err) => console.log("MongoDB connection failed", err));
