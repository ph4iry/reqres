import { Router } from 'express';

import * as projectsRoutes from './routes/projects';
import * as projectByIdRoutes from './routes/projects/[id]';
import * as endpointByProjectIdRoutes from './routes/projects/[id]/endpoints';

export const createRouter = (): Router => {
  const router = Router();

  router.get('/projects', projectsRoutes.GET);
  router.post('/projects', projectsRoutes.POST);

  router.get('/projects/:id', projectByIdRoutes.GET);
  router.put('/projects/:id', projectByIdRoutes.PUT);
  router.delete('/projects/:id', projectByIdRoutes.DELETE);

  router.get('/projects/:id/endpoints', endpointByProjectIdRoutes.GET);
  router.post('/projects/:id/endpoints', endpointByProjectIdRoutes.POST);

  console.log(`Router registered ${router.stack.length} routes successfully`);
  return router;
}