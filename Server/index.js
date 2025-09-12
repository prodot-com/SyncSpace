import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspaces.js";
import boardRoutes from "./routes/boards.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});

// Socket.IO events (Week 2)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("board:task:create", (data) => {
    io.emit("board:task:created", data);
  });

  socket.on("board:task:update", (data) => {
    io.emit("board:task:updated", data);
  });

  socket.on("doc:update", (update) => {
    socket.broadcast.emit("doc:update", update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
