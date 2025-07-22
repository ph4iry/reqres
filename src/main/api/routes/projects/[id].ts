import { Request, Response } from 'express';
import { ProjectService } from '../../../api/services/ProjectService';

const projectService = new ProjectService();

export const GET = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectWithStats(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('Project with stats:', project);
    return res.json({ project });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const PUT = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.body);

    console.log('Updating project:', project);
    return res.json({ project });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export const DELETE = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await projectService.deleteProject(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project' });
  }
}