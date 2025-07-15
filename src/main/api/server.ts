import express from 'express';
import cors from 'cors';
import { createRouter } from './router';
import { dbManager } from '../database';

export const startApiServer = () => {
  const app = express();
  const PORT = 3001;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (dbManager.isConnected) {
    const router = createRouter();
    app.use('/api', router);
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
};