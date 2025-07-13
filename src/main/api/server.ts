import express from 'express';
import cors from 'cors';
import { createFileRouter } from './utils/fileRouter';
import * as path from 'path';

export const startApiServer = () => {
  const app = express();
  const PORT = 3001;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // File-based routing
  const routesPath = path.join(__dirname, 'routes');
  const router = createFileRouter(routesPath);
  app.use('/api', router);

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
};