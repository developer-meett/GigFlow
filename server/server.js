const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const gigRoutes = require('./routes/gigRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap Express with HTTP for Socket.io

// 1. Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Your Frontend URL (Vite default)
  credentials: true, // Allow Cookies
}));

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 3. Socket.io Setup (The Hotel Reception)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Global Notepad for Online Users
global.onlineUsers = {}; 
global.io = io; // Make io accessible in Controllers

io.on("connection", (socket) => {
  // When user logs in, they send their User ID
  socket.on("addNewUser", (userId) => {
    global.onlineUsers[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    // Ideally, remove user from object here
    console.log("User disconnected");
  });
});

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', gigRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));