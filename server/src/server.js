import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Ivy Homes MERN Server running on port ${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/health`);
    console.log(` Client URL:   ${config.clientUrl}`);
    console.log(` Base API:     ${config.ivyApiBaseUrl}`);
    console.log(`=======================================================`);
  });
}

startServer().catch(err => {
  console.error('[Fatal Server Startup Error]:', err);
  process.exit(1);
});
