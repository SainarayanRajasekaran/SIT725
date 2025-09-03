// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const { connectDB } = require('./config');
const { quoteRouter } = require('./routes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', quoteRouter);


function startHttpAndSocket() {
  const PORT = process.env.PORT || 3001;

  // Create HTTP server first
  const server = http.createServer(app);

  // Attach Socket.IO
  const { Server } = require('socket.io');
  const io = new Server(server, {
    path: '/live',             
    cors: {
      origin: '*',             
      methods: ['GET', 'POST']
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log('Socket connected');

    const start = Date.now();

    // Send a welcome event once
    socket.emit('hello', { message: 'Connected to /live' });

    // Emit uptime every second
    const tick = setInterval(() => {
      const seconds = Math.floor((Date.now() - start) / 1000);
      socket.emit('uptime', { seconds });
    }, 1000);

    // Clean up when the client disconnects
    socket.on('disconnect', () => {
      clearInterval(tick);
      console.log('Socket disconnected');
    });

    //allow client to request current server time
    socket.on('server:now', () => {
      socket.emit('server:now', { iso: new Date().toISOString() });
    });
  });

  server.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );

  return server;
}

// Only start when not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  startHttpAndSocket();
}

module.exports = app;
