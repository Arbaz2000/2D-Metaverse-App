import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new player joining
  socket.on('playerJoin', (data) => {
    const { username, color } = data;
    connectedUsers.set(socket.id, { username, color });
    
    // Emit to all clients that a new player has joined
    io.emit('playerJoined', {
      id: socket.id,
      username,
      color,
      position: { x: 400, y: 300 } // Default spawn position
    });
  });

  // Handle player movement
  socket.on('playerMove', (data) => {
    // Broadcast the movement to all other clients
    socket.broadcast.emit('playerMoved', {
      id: socket.id,
      position: data.position
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('playerDisconnected', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metaverse')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to 2D Metaverse API' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 