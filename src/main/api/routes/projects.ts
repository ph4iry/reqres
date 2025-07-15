import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';

const projectService = new ProjectService();

export const GET = async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const POST = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
  } catch (error) {
    return res.status(400).json({ error: error || 'Bad request' });
  }
}