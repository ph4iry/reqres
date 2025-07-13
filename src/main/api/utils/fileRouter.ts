import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const createFileRouter = (routesDir: string): Router => {
  const router = Router();

  const loadRoutes = (dir: string, basePath: string = '') => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        loadRoutes(filePath, path.join(basePath, file));
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        const routePath = path.join(basePath, file.replace(/\.(ts|js)$/, ''));
        const normalizedPath = routePath.replace(/\\/g, '/');
        
        const expressPath = normalizedPath.replace(/\[([^\]]+)\]/g, ':$1');
        
        const routeModule = require(filePath);
        
        if (routeModule.GET) router.get(`/${expressPath}`, routeModule.GET);
        if (routeModule.POST) router.post(`/${expressPath}`, routeModule.POST);
        if (routeModule.PUT) router.put(`/${expressPath}`, routeModule.PUT);
        if (routeModule.DELETE) router.delete(`/${expressPath}`, routeModule.DELETE);
        if (routeModule.PATCH) router.patch(`/${expressPath}`, routeModule.PATCH);
      }
    });
  };

  loadRoutes(routesDir);
  return router;
};