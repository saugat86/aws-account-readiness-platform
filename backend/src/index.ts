import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { businessRoutes } from './routes/business';
import { documentRoutes } from './routes/documents';
import { scoringRoutes } from './routes/scoring';
import { appealRoutes } from './routes/appeals';
import { sanitizeRequest } from './middleware/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest); // Sanitize all incoming requests

// Apply rate limiting middleware
import { apiLimiter, scoringLimiter, authLimiter } from './middleware/rateLimiter';

app.use('/api', apiLimiter); // General rate limiting for all API routes

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/scoring', scoringLimiter, scoringRoutes);
app.use('/api/appeals', appealRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});