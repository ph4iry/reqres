import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

class DatabaseManager {
  private db: Database.Database | null = null;
  private dbPath: string | null = null;
  isConnected: boolean = false;

  constructor() {}

  private initializePath(): void {
    if (this.dbPath) return;

    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'databases');
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'reqres-studio.db');
  }

  connect(): Database.Database {
    const startTime = Date.now();
    if (this.db) {
      return this.db;
    }

    this.initializePath();

    console.log('initialized')

    if (!this.dbPath) {
      throw new Error('Database path not initialized');
    }

    console.log('Connecting to database at:', this.dbPath);

    this.db = new Database(this.dbPath);
    
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    this.initializeSchema();
    
    console.log('Database connected:', this.dbPath);
    const endTime = Date.now();
    console.log(`Database connection established in ${endTime - startTime}ms`);
    this.isConnected = true;
    return this.db;
  }

  private initializeSchema(): void {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        version TEXT DEFAULT '1.0.0',
        baseUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS endpoints (
        id TEXT PRIMARY KEY,
        projectId TEXT NOT NULL,
        method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS')),
        path TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        tags TEXT, -- JSON array
        operationId TEXT,
        deprecated BOOLEAN DEFAULT FALSE,
        requestBody TEXT, -- JSON object
        responses TEXT, -- JSON object
        parameters TEXT, -- JSON array
        documentation TEXT, -- Markdown
        folder TEXT,
        sortOrder INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documentation (
        id TEXT PRIMARY KEY,
        projectId TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        slug TEXT NOT NULL,
        parentId TEXT,
        sortOrder INTEGER DEFAULT 0,
        published BOOLEAN DEFAULT TRUE,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES documentation (id) ON DELETE CASCADE,
        UNIQUE(projectId, slug)
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS environments (
        id TEXT PRIMARY KEY,
        projectId TEXT NOT NULL,
        name TEXT NOT NULL,
        baseUrl TEXT NOT NULL,
        variables TEXT, -- JSON object
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS request_history (
        id TEXT PRIMARY KEY,
        endpointId TEXT NOT NULL,
        environmentId TEXT,
        request TEXT NOT NULL, -- JSON object
        response TEXT, -- JSON object
        status INTEGER,
        duration INTEGER, -- milliseconds
        createdAt TEXT NOT NULL,
        FOREIGN KEY (endpointId) REFERENCES endpoints (id) ON DELETE CASCADE,
        FOREIGN KEY (environmentId) REFERENCES environments (id) ON DELETE SET NULL
      )
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_endpoints_project ON endpoints (projectId);
      CREATE INDEX IF NOT EXISTS idx_endpoints_method_path ON endpoints (method, path);
      CREATE INDEX IF NOT EXISTS idx_documentation_project ON documentation (projectId);
      CREATE INDEX IF NOT EXISTS idx_documentation_parent ON documentation (parentId);
      CREATE INDEX IF NOT EXISTS idx_environments_project ON environments (projectId);
      CREATE INDEX IF NOT EXISTS idx_request_history_endpoint ON request_history (endpointId);
    `);

    console.log('Database schema initialized');
  }

  getDatabase(): Database.Database {
    if (!this.db) {
      return this.connect();
    }
    return this.db;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }

  backup(backupPath: string): void {
    if (!this.db) return;
    
    this.db.backup(backupPath)
      .then(() => console.log('Database backup completed:', backupPath))
      .catch(console.error);
  }

  getDbPath(): string | null {
    return this.dbPath;
  }
}

export const dbManager = new DatabaseManager();
export const getDb = () => dbManager.getDatabase();