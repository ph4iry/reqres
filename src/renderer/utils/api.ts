const API_BASE_URL = 'http://localhost:3001/api';
import { Endpoint, Project } from '@main/database/schema';

export class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch (`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async getProjects() {
    console.log('Fetching projects from API');
    return this.request<{ projects: Project[] }>('/projects');
  }

  async createProject(data: {
    name: string;
    description?: string;
    version: string;
    baseUrl: string;
  }) {
    console.log('Creating project with these params:', data);
    return this.request<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProject(id: string) {
    return this.request<{ project: Project }>(`/projects/${id}`);
  }

  async updateProject(id: string, data: Partial<Project>) {
    return this.request<{ project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async createEndpoint(projectId: string, path: string) {
    return this.request<{ endpoint: Endpoint }>(`/projects/${projectId}/endpoints/`, {
      method: 'POST',
      body: JSON.stringify({ projectId, path }),
    });
  }

  async getEndpoints(projectId: string) {
    return this.request<{ endpoints: Endpoint[] }>(`/projects/${projectId}/endpoints`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();