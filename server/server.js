const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Load routes
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app); 

// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL]
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("MongoDB Connected Successfully");
    }
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Configure Socket.io for real-time notifications
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Store online users for real-time notifications
global.onlineUsers = {}; 
global.io = io; 

// Handle socket connections for real-time features
io.on("connection", (socket) => {
  // Register user when they connect
  socket.on("addNewUser", (userId) => {
    if (userId) {
      global.onlineUsers[userId] = socket.id;
    }
  });

  // Clean up when user disconnects
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(global.onlineUsers)) {
      if (socketId === socket.id) {
        delete global.onlineUsers[userId];
        break;
      }
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes); // <--- 2. Added Missing Route Middleware

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
  }
});