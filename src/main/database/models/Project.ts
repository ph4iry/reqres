import { getDb } from "..";
import { Project } from "../schema";
import { v4 as uuidv4 } from "uuid";

export class ProjectModel {
  private db = getDb();

  private insertStmt = this.db.prepare(`
    INSERT INTO projects (id, name, description, version, baseUrl, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  private updateStmt = this.db.prepare(`
    UPDATE projects
    SET name = ?, description = ?, version = ?, baseUrl = ?, updatedAt = ?
    WHERE id = ?
  `);

  private findByIdStmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
  private findAllStmt = this.db.prepare('SELECT * FROM projects ORDER BY updatedAt DESC');
  private deleteStmt = this.db.prepare('DELETE FROM projects WHERE id = ?');

  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const now = new Date().toISOString();
    const project: Project = {
      id: uuidv4(),
      name: data.name,
      description: data.description || '',
      version: data.version || '1.0.0',
      baseUrl: data.baseUrl || '',
      createdAt: now,
      updatedAt: now
    }

    this.insertStmt.run(
      project.id,
      project.name,
      project.description || null,
      project.version,
      project.baseUrl || null,
      project.createdAt,
      project.updatedAt
    );

    return project;
  }

  findById(id: string): Project | null {
    const row = this.findByIdStmt.get(id) as any;
    return row || null;
  }

  findAll(): Project[] {
    return this.findAllStmt.all() as Project[];
  }

  update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: Project = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    }

    this.updateStmt.run(
      updated.name,
      updated.description || null,
      updated.version,
      updated.baseUrl || null,
      updated.updatedAt,
      id
    );

    return updated;
  }

  delete(id: string): boolean {
    const result = this.deleteStmt.run(id);
    return result.changes > 0;
  }

  getStats(projectId: string): { endpointCount: number, documentatonCount: number } {
    const { count: endpointCount } = this.db.prepare('SELECT COUNT(*) as count FROM endpoints WHERE projectId = ?').get(projectId) as any;
    const { count: documentatonCount } = this.db.prepare('SELECT COUNT(*) as count FROM documentation WHERE projectId = ?').get(projectId) as any;

    return {
      endpointCount,
      documentatonCount
    };
  }
}