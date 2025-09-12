import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js"
import userRoutes from './routes/users.route.js';
import teamRoutes from './routes/teams.route.js';
import workspaceRoutes from './routes/workspace.routes.js';
import taskRoutes from './routes/tasks.routes.js';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("SyncSpace backend running");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);

export { app };
