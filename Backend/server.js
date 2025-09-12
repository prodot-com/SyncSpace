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

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

connect_db()
  .then(() => console.log())
  .catch((err) => console.log("MongoDB connection failed", err));
