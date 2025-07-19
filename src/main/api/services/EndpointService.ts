import { EndpointModel } from '../../database/models/Endpoint';
import { Endpoint } from '../../database/schema';
import { dbManager } from '@main/database';

export class EndpointService {
  private endpointModel = new EndpointModel();

  createEndpoint(data: {
    projectId: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    path: string;
    title: string;
    description?: string;
    tags?: string; // json string array
    operationId: string;
    requestBody?: string; // json string
    responses?: string; // json string
    parameters?: string; // json string
    documentation?: string; // markdown content
    deprecated?: boolean;
    folder?: string;
    sortOrder?: number,
  }): Endpoint {
    if (!data.path.trim()) {
      throw new Error('Endpoint path cannot be empty');
    }

    if (!data.projectId.trim()) {
      throw new Error('Endpoint must be assigned to a project on creation')
    }

    if (!data.method) {
      throw new Error('http method required');
    }

    if (!data.title || !data.title.trim()) {
      throw new Error('endpoint title is required');
    }

    if (!data.path.startsWith('/')) {
      data.path = '/' + data.path;
    }

    // the endpoint path + method must be unique as well
    const existingEndpoint = this.endpointModel.findByMethodAndPath(data.projectId, data.method, data.path);
    if (existingEndpoint) throw new Error (`Endpoint ${data.method} ${data.path} already exists in this project`);

    return this.endpointModel.create({
      projectId: data.projectId,
      method: data.method,
      path: data.path.trim(),
      title: data.title.trim(),
      description: data.description,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      operationId: data.operationId,
      deprecated: data.deprecated || false,
      requestBody: data.requestBody ? JSON.stringify(data.requestBody) : undefined,
      responses: data.responses ? JSON.stringify(data.responses) : undefined,
      parameters: data.parameters ? JSON.stringify(data.parameters) : undefined,
      documentation: data.documentation,
      folder: data.folder || 'General',
      sortOrder: data.sortOrder || 0
    });
  }

  getEndpoint(id: string): Endpoint | null {
    const endpoint = this.endpointModel.findById(id);
    if (!endpoint) return null;

    return this.parseEndpointData(endpoint);
  }

  getEndpointsByProject(projectId: string): Endpoint[] {
    const endpoints = this.endpointModel.findByProject(projectId);
    return endpoints.map(e => this.parseEndpointData(e));
  }

  updateEndpoint(id: string, data: Partial<Endpoint>) {
    const existing = this.endpointModel.findById(id);
    if (!existing) throw new Error('endpoint not found');

    if(data.method || data.path) {
      const method = data.method || existing.method;
      const path = data.path || existing.path;

      const duplicate = this.endpointModel.findByMethodAndPath(existing.projectId, method, path);

      if (duplicate && duplicate.id !== id) {
        throw new Error(`Endpoint ${method} ${path} already exists in this project`);
      }
    }

    const stringifyIfNecessary = (param: string | object | undefined): string | undefined =>  {
      return param ? (typeof param === 'object' ? JSON.stringify(param) : param) : undefined
    }

    const updateData: any = {
      ...data,
      requestBody: stringifyIfNecessary(data.requestBody),
      responses: stringifyIfNecessary(data.responses),
      parameters: stringifyIfNecessary(data.parameters),
    };

    const updated = this.endpointModel.update(id, updateData);
    return updated ? this.parseEndpointData(updated) : null;
  }

  deleteEndpoint(id: string): boolean {
    return this.endpointModel.delete(id);
  }

  getEndpointsByFolder(projectId: string): { [folder: string]: Endpoint[] } {
    const endpoints = this.endpointModel.findByProject(projectId);
    const parsed = endpoints.map(endpoints => this.parseEndpointData(endpoints));

    const grouped: { [folder: string]: Endpoint[] } = {};

    parsed.forEach(endpoint => {
      const folder = endpoint.folder || 'General';
      if (!grouped[folder]) grouped[folder] = [];
      grouped[folder].push(endpoint);
    });

    return grouped;
  }

  reorderEndpoints(endpointIds: string[]): void {
    this.endpointModel.updateOrder(endpointIds);
  }

  duplicateEndpoint(id: string): Endpoint {
    const original = this.endpointModel.findById(id);

    if (!original) throw new Error('Endpoint not found');

    const parsedOriginal = this.parseEndpointData(original);

    const parseIfNecessary = (param: string | object | undefined): object | undefined =>  {
      return param ? (typeof param === 'string' ? JSON.parse(param) : param) : undefined
    }

    return this.createEndpoint({
      ...parsedOriginal,
      path: `${parsedOriginal}-copy`,
      title: `${parsedOriginal.title} (Copy)`,
      operationId: `${parsedOriginal.operationId}_copy`,
    })
  }

  getEndpointStats(projectId: string): {
    totalEndpoints: number,
    methodCounts: { [method: string]: number },
    folderCounts: { [folder: string]: number },
    deprecatedCount: number,
    documentedCount: number,
  } {
    const endpoints = this.endpointModel.findByProject(projectId);

    const stats = {
      totalEndpoints: endpoints.length,
      methodCounts: {} as { [method: string]: number },
      folderCounts: {} as { [folder: string]: number },
      deprecatedCount: 0,
      documentedCount: 0
    };

    endpoints.forEach(endpoint => {
      stats.methodCounts[endpoint.method] = (stats.methodCounts[endpoint.method] || 0) + 1;

      const folder = endpoint.folder || 'General'
      stats.folderCounts[folder] = (stats.folderCounts[folder] || 0) + 1;

      if (endpoint.deprecated) {
        stats.deprecatedCount++;
      }

      if (endpoint.documentation && endpoint.documentation.trim()) {
        stats.documentedCount++;
      }
    });

    return stats;
  }

  searchEndpoints(projectId: string, query: string) {
    const endpoints = this.endpointModel.findByProject(projectId);
    const parsed = endpoints.map(endpoint => this.parseEndpointData(endpoint));
    
    const searchTerm = query.toLowerCase();
    
    return parsed.filter(endpoint => 
      endpoint.title.toLowerCase().includes(searchTerm) ||
      endpoint.path.toLowerCase().includes(searchTerm) ||
      endpoint.description?.toLowerCase().includes(searchTerm) ||
      endpoint.method.toLowerCase().includes(searchTerm) ||
      endpoint.folder?.toLowerCase().includes(searchTerm)
    );
  }

  validateEndpointPath(projectId: string, method: string, path: string, excludeId?: string): boolean {
    const existing = this.endpointModel.findByMethodAndPath(projectId, method, path);
    return !existing || existing.id === excludeId;
  }

  private parseEndpointData(endpoint: any): Endpoint {
    return {
      ...endpoint,
      tags: endpoint.tags ?? JSON.parse(endpoint.tags),
      requestBody: endpoint.requestBody ?? JSON.parse(endpoint.requestBody),
      responses: endpoint.responses ?? JSON.parse(endpoint.responses),
      parameters: endpoint.parameters ?? JSON.parse(endpoint.parameters)
    }
  }
}