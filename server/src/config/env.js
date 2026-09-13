import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ivy_homes_db',
  ivyApiBaseUrl: process.env.IVY_API_BASE_URL || 'https://solve.ivy.homes',
  ivyApiKey: process.env.IVY_API_KEY || 'IVY26-8C91903DE8E1',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_ivy_homes_jwt_key_2026'
};
