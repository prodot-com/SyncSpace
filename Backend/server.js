// import 'dotenv/config';
// import connect_db from "./src/db/Index.js";
// import { app } from "./App.js";
// import { Server } from "socket.io";
// import jwt from "jsonwebtoken";

// const PORT = process.env.PORT || 9000;

// const server = app.listen(PORT, () => {
//   console.log(`App + Socket.IO listening at port ${PORT}`);
// });

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173", 
//     ],
//     credentials: true,
//   },
// });

// // Socket auth
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Authentication error: No token provided"));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });

// // Just a base socket event for now
// io.on("connection", (socket) => {
//   console.log(`User ${socket.user.id} connected`);

//   // ✅ Join Workspace Room
//   socket.on("joinWorkspace", (workspaceId) => {
//     socket.join(`workspace-${workspaceId}`);
//     console.log(`User ${socket.user.id} joined workspace-${workspaceId}`);
//   });

//   // ✅ Chat Messages
//   socket.on("sendMessage", ({ content, workspaceId }) => {
//     const message = {
//       content,
//       workspaceId,
//       sender: {
//         _id: socket.user.id,
//         name: socket.user.name || "Unknown User",
//       },
//       createdAt: new Date(),
//     };

//     io.to(`workspace-${workspaceId}`).emit("receiveMessage", message);
//   });

//   // ✅ Kanban Updates
//   socket.on("taskUpdated", (task) => {
//     io.to(`workspace-${task.workspace}`).emit("taskUpdated", task);
//   });

//   // ✅ Document Updates
//   socket.on("docUpdated", ({ docId, content }) => {
//     io.to(`doc-${docId}`).emit("docUpdated", { docId, content });
//   });

//   socket.on("joinDoc", (docId) => {
//     socket.join(`doc-${docId}`);
//     console.log(`User ${socket.user.id} joined doc-${docId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User ${socket.user.id} disconnected`);
//   });
// });



// connect_db()
//   .then(() => console.log())
//   .catch((err) => console.log("MongoDB connection failed", err));


import 'dotenv/config';
import connect_db from "./src/db/Index.js";
import { app } from "./App.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Document } from './models/document.model.js';
import { Chat } from './models/Chat.model.js';

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

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`User ${socket.user.id} connected`);

  // --- Workspace & General Events ---
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(`workspace-${workspaceId}`);
    console.log(`User ${socket.user.id} joined workspace-${workspaceId}`);
  });

  // --- Chat Functionality ---
  socket.on("sendMessage", async ({ content, workspaceId }) => {
    if (!content || !workspaceId) return;
    try {
      const message = await Chat.create({ content, workspace: workspaceId, sender: socket.user.id });
      const populatedMessage = await message.populate("sender", "name email");
      io.to(`workspace-${workspaceId}`).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  // --- Real-time Document Editor Events ---
  socket.on("join-document", async (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.user.id} joined document ${documentId}`);
    
    // Load the latest document version and send it to the joining client
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
    // Broadcast the changes (delta) to all other clients in the document room
    socket.broadcast.to(documentId).emit("receive-changes", delta);
  });

  socket.on("save-document", async ({ documentId, data }) => {
    // Save the full document data to the database
    try {
        await Document.findByIdAndUpdate(documentId, { data });
        console.log(`Document ${documentId} saved successfully.`);
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
    console.log(`User ${socket.user.id} disconnected`);
  });
});

connect_db()
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log("MongoDB connection failed", err));

