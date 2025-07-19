import { getDb } from '..';
import { Endpoint } from '../schema';
import { v4 as uuidv4 } from 'uuid';

export class EndpointModel {
  private db = getDb();
  
  private insertStmt = this.db.prepare(`
    INSERT INTO endpoints (
      id, projectId, method, path, title, description, tags, operationId, 
      deprecated, requestBody, responses, parameters, documentation, 
      folder, sortOrder, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  private updateStmt = this.db.prepare(`
    UPDATE endpoints 
    SET method = ?, path = ?, title = ?, description = ?, tags = ?, 
        operationId = ?, deprecated = ?, requestBody = ?, responses = ?, 
        parameters = ?, documentation = ?, folder = ?, sortOrder = ?, updatedAt = ?
    WHERE id = ?
  `);

  private findByIdStmt = this.db.prepare('SELECT * FROM endpoints WHERE id = ?');
  private findByProjectStmt = this.db.prepare('SELECT * FROM endpoints WHERE projectId = ? ORDER BY sortOrder, createdAt');
  private deleteStmt = this.db.prepare('DELETE FROM endpoints WHERE id = ?');

  create(data: Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>): Endpoint {
    const now = new Date().toISOString();
    const endpoint: Endpoint = {
      id: uuidv4(),
      ...data,
      deprecated: data.deprecated || false,
      sortOrder: data.sortOrder || 0,
      createdAt: now,
      updatedAt: now,
    };

    this.insertStmt.run(
      endpoint.id,
      endpoint.projectId,
      endpoint.method,
      endpoint.path,
      endpoint.title,
      endpoint.description || null,
      endpoint.tags || null,
      endpoint.operationId || null,
      endpoint.deprecated ? 1 : 0,
      endpoint.requestBody || null,
      endpoint.responses || null,
      endpoint.parameters || null,
      endpoint.documentation || null,
      endpoint.folder || null,
      endpoint.sortOrder,
      endpoint.createdAt,
      endpoint.updatedAt
    );

    return endpoint;
  }

  findById(id: string): Endpoint | null {
    const row = this.findByIdStmt.get(id) as any;
    if (!row) return null;
    
    // Convert boolean fields
    return {
      ...row,
      deprecated: Boolean(row.deprecated),
    };
  }

  findByProject(projectId: string): Endpoint[] {
    const rows = this.findByProjectStmt.all(projectId) as any[];
    return rows.map(row => ({
      ...row,
      deprecated: Boolean(row.deprecated),
    }));
  }

  findByMethodAndPath(projectId: string, method: string, path: string): Endpoint | null {
    const row = this.db.prepare('SELECT * FROM endpoints WHERE projectId = ? AND method = ? AND path = ?').get(projectId, method, path) as any;

    if (!row) return null;

    return {
      ...row,
      deprecated: Boolean(row.deprecated)
    }
  }

  update(id: string, data: Partial<Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>>): Endpoint | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: Endpoint = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.updateStmt.run(
      updated.method,
      updated.path,
      updated.title,
      updated.description || null,
      updated.tags || null,
      updated.operationId || null,
      updated.deprecated ? 1 : 0,
      updated.requestBody || null,
      updated.responses || null,
      updated.parameters || null,
      updated.documentation || null,
      updated.folder || null,
      updated.sortOrder,
      updated.updatedAt,
      id
    );

    return updated;
  }

  delete(id: string): boolean {
    const result = this.deleteStmt.run(id);
    return result.changes > 0;
  }

  // Get endpoints grouped by folder
  getByFolder(projectId: string): { [folder: string]: Endpoint[] } {
    const endpoints = this.findByProject(projectId);
    const grouped: { [folder: string]: Endpoint[] } = {};

    endpoints.forEach(endpoint => {
      const folder = endpoint.folder || 'default';
      if (!grouped[folder]) grouped[folder] = [];
      grouped[folder].push(endpoint);
    });

    return grouped;
  }

  // Reorder endpoints
  updateOrder(endpointIds: string[]): void {
    const updateOrderStmt = this.db.prepare('UPDATE endpoints SET sortOrder = ? WHERE id = ?');
    
    const transaction = this.db.transaction(() => {
      endpointIds.forEach((id, index) => {
        updateOrderStmt.run(index, id);
      });
    });

    transaction();
  }
}