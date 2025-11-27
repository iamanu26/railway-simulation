// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from any origin
        methods: ["GET", "POST"]
    }
});

// This runs when any dashboard connects to the server
io.on('connection', (socket) => {
    console.log('✅ A user connected:', socket.id);

    // Listen for the master simulation state and broadcast it to everyone
    socket.on('broadcastState', (state) => {
        io.emit('stateUpdate', state); // Send 'stateUpdate' to all clients
    });

    // Listen for a specific message to a pilot and broadcast it
    socket.on('controlMessageToPilot', (messageData) => {
        io.emit('pilotMessage', messageData);
    });

    // Listen for an emergency stop and broadcast it
    socket.on('emergencyStop', (alertData) => {
        io.emit('emergencyAlert', alertData);
    });
    
    // Listen for a resume request and broadcast it
    socket.on('resumeRequest', (requestData) => {
        io.emit('resumeRequestAlert', requestData);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});