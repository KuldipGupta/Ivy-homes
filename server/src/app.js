import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/apiError.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import favouriteRoutes from './routes/favouriteRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import diagnosticsRoutes from './routes/diagnosticsRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Rate limiter: 1200 requests per minute per IP matching the Ivy Homes limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Rate limit exceeded. Please slow down your requests.'
  }
});
app.use(limiter);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Observability request logger
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Ivy Homes Property Marketplace Backend',
    server_time: new Date().toISOString(),
    city: 'Bangalore'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/diagnostics', diagnosticsRoutes);

// 404 handler for undefined API routes
app.use('*', (req, res, next) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorMiddleware);

export default app;
