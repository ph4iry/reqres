export interface Project {
  id: string;
  name: string;
  description?: string;
  version: string;
  baseUrl: string;
  createdAt: string,
  updatedAt: string;
}

export interface Endpoint {
  id: string;
  projectId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  path: string;
  title: string;
  description?: string;
  tags?: string; // json string array
  operationId: string;
  requestBody?: string; // json string
  responses: string; // json string
  parameters?: string; // json string
  documentation?: string; // markdown content
  deprecated?: boolean;
  folder?: string;
  sortOrder: number,
  createdAt: string,
  updatedAt: string;
}

export interface Documentation {
  id: string;
  projectId: string;
  title: string;
  content: string; // markdown content
  slug: string; // URL-friendly slug
  parentId?: string; // for nested pages
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Environment {
  id: string;
  projectId: string;
  name: string;
  baseUrl: string;
  variables?: string; // json string of key-value pairs
  createdAt: string;
  updatedAt: string;
}

export interface RequestHistory {
  id: string;
  endpointId: string;
  environmentId: string;
  request: string;
  response?: string; // json string of req details
  status?: number,
  duration?: number; // in milliseconds
  createdAt: string;
}