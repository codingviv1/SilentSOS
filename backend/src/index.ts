import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes';
import moodRoutes from './routes/mood.routes';
import journalRoutes from './routes/journal.routes';
import analysisRoutes from './routes/analysis.routes';

// Import services
import { AlertService } from './services/alert.service';

// Import middleware
import { loadingMiddleware } from './middleware/loading';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize alert service
const alertService = new AlertService(io);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(loadingMiddleware);
app.use('/api/', apiLimiter); // Apply general rate limiter to all API routes
app.use('/api/auth', authLimiter); // Apply stricter rate limiter to auth routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/analysis', analysisRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Join user's room for private messages
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 