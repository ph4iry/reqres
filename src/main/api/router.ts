import { Router } from 'express';

import * as projectsRoutes from './routes/projects';
// import * as projectByIdRoutes from './routes/projects/[id]';

export const createRouter = (): Router => {
  const router = Router();

  if (projectsRoutes.GET) router.get('/projects', projectsRoutes.GET);
  if (projectsRoutes.POST) router.post('/projects', projectsRoutes.POST);

  // if (projectByIdRoutes.GET) router.get('/projects/:id', projectByIdRoutes.GET);
  // if (projectByIdRoutes.PUT) router.put('/projects/:id', projectByIdRoutes.PUT);
  // if (projectByIdRoutes.DELETE) router.delete('/projects/:id', projectByIdRoutes.DELETE);

  console.log(`Router registered ${router.stack.length} routes successfully`);
  return router;
}