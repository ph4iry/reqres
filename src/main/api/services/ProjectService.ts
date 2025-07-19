import { ProjectModel } from '../../database/models/Project';
import { Project } from '../../database/schema';
import { dbManager } from '@main/database';

export class ProjectService {
  private projectModel = new ProjectModel();

  async createProject(data: {
    name: string;
    description?: string;
    version: string;
    baseUrl: string;
  }): Promise<Project> {
    if (!data.name.trim()) {
      throw new Error('Project name cannot be empty');
    }

    return this.projectModel.create(data);
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projectModel.findById(id);
  }

  async getAllProjects(): Promise<Project[]> {
    const result = this.projectModel.findAll();
    console.log('from project service:', result);
    return result;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    const updated = this.projectModel.update(id, data);
    if (!updated) {
      throw new Error('Project not found');
    }
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projectModel.delete(id);
  }

  async getProjectWithStats(id: string): Promise<(Project & { stats: any }) | null> {
    const project = this.projectModel.findById(id);
    if (!project) return null;

    const stats = this.projectModel.getStats(id);
    return { ...project, stats };
  }
}