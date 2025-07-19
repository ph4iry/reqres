'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { Project } from '../../../main/database/schema';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EndpointEditor from '../../components/editor/Editor';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
    
    const hash = window.location.hash.substring(1);
    if (hash) {
      console.log('has a hash')
      setSelectedProjectId(hash);
    }
    
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setSelectedProjectId(hash || null);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      // setLoading(true);
      console.log('loading projects...')
      const response = await apiClient.getProjects();
      console.log('projects loaded:', response.projects);
      setProjects(response.projects);
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  };

  const loadProject = async (id: string) => {
    try {
      const { project } = await apiClient.getProject(id);
      setSelectedProject(project);
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  }

  useEffect(() => { loadProjects() }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }
  if (error) {
    return <div>Error loading projects: {error}</div>;
  }

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await apiClient.deleteProject(projectId);
        loadProjects(); // reload
      } catch (err) {
        alert(`Failed to delete project: ${err}`);
      }
    }
  }

  if (selectedProjectId && selectedProject) {
    return <EndpointEditor project={selectedProject} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bricolage font-bold">Projects</h1>
        <Link 
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:scale-105 transition"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first API documentation project</p>

          <Link 
            href="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:scale-105 transition"
          >
            <Plus size={16} />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div onClick={() => router.push(`/projects#${project.id}`)} tabIndex={i} key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-black" size={20} />
                <h3 className="text-xl font-semibold">{project.name}</h3>
              </div>
              
              {project.description && (
                <p className="text-gray-600 mb-3">{project.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  v{project.version} • {new Date(project.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProjectId(project.id)}
                    className="p-2 text-black hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}