import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIO(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_game', (gameId: string) => {
    socket.join(`game:${gameId}`);
    console.log(`Socket ${socket.id} joined game ${gameId}`);
  });

  socket.on('leave_game', (gameId: string) => {
    socket.leave(`game:${gameId}`);
    console.log(`Socket ${socket.id} left game ${gameId}`);
  });

  socket.on('chat_message', (data: { gameId: string; message: string }) => {
    io.to(`game:${data.gameId}`).emit('chat_message', {
      id: socket.id,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('player_action', (data: { gameId: string; action: any }) => {
    socket.to(`game:${data.gameId}`).emit('player_action', {
      playerId: socket.id,
      action: data.action,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(config.port, config.host, () => {
  console.log(`
🚀 PlayVerse API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: ${config.nodeEnv}
Server: http://${config.host}:${config.port}
API: http://${config.host}:${config.port}/api
Health: http://${config.host}:${config.port}/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export { io };
