import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { businessRoutes } from './routes/business';
import { documentRoutes } from './routes/documents';
import { scoringRoutes } from './routes/scoring';
import { appealRoutes } from './routes/appeals';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/appeals', appealRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});