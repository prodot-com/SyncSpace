import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js"
import userRoutes from './routes/users.route.js';
import teamRoutes from './routes/teams.route.js';
import workspaceRoutes from './routes/workspace.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import documentRoutes from './routes/document.routes.js'
import chatRoutes from './routes/chat.routes.js'
import commentRoutes from './routes/comment.routes.js'
import adminRoutes from './routes/admin.routes.js'
import helpRoutes from './routes/help.routes.js'
import notificationRoutes from './routes/notification.route.js'

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get('/', (req, res) => {
  res.send("SyncSpace backend running");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comments', commentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/help', helpRoutes)
app.use('/api/notifications', notificationRoutes);

export { app };
