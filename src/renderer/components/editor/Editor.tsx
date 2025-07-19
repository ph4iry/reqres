import { FileText } from "lucide-react";
import { Project, Endpoint, Documentation } from "../../../main/database/schema";
import { useState, useEffect } from "react";
import { apiClient } from "../../utils/api";
import Header from "./Header";
import Sidebar from "./Sidebar";
import EndpointDetails from "./endpoints/Details";
import ActionsSidebar from "./docs/ActionBar";
import ImportExport from "./docs/ImportExport";

export default function EndpointEditor({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [documentationPages, setDocumentationPages] = useState<Documentation[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [requestView, setRequestView] = useState('form');
  const [exampleLang, setExampleLang] = useState('curl');
  const [selectedStatusCode, setSelectedStatusCode] = useState('200');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project) {
      loadProjectData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const loadProjectData = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const { endpoints: endpointsResponse } = await apiClient.getEndpoints(project.id);
      if (endpointsResponse) {
        setEndpoints(endpointsResponse || []);
        
        
        const folders = [...new Set(endpointsResponse.map((e: Endpoint) => e.folder).filter(Boolean))] as string[];
        setExpandedFolders(folders);
        if (endpointsResponse?.[0]) {
          setSelectedEndpoint(endpointsResponse[0].id);
        }
      }

      // TODO: update this to be an apiClient call
      const docsResponse = await fetch(`http://localhost:3001/api/projects/${project.id}/documentation`);
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setDocumentationPages(docsData.pages || []);
      }
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleRunEndpoint = async () => {
    if (!selectedEndpoint || !project) return;
    
    const endpoint = endpoints.find(e => e.id === selectedEndpoint);
    if (!endpoint) return;

    try {
      const baseUrl = project.baseUrl || 'https://api.example.com';
      const fullUrl = `${baseUrl}${endpoint.path}`;
      
      const response = await fetch(fullUrl, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        ...(endpoint.method !== 'GET' && endpoint.requestBody && {
          body: JSON.stringify(endpoint.requestBody)
        })
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleAddEndpoint = async (path: string) => {
    const { endpoint } = await apiClient.createEndpoint(project.id, path);
    setEndpoints([...endpoints, endpoint]);
  };

  const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint);

  if (!project) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
          <p className="text-gray-600">Please select a project to view its API documentation.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50/30 not-dark:via-white/30 to-purple-50/30 dark:from-black/40 dark:to-purple-950/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br not-dark:from-blue-100/20 not-dark:via-transparent not-dark:to-purple-100/20 pointer-events-none" />
      
      <Header 
        project={project} 
        onBack={() => window.location.hash = ''} 
      />

      <div className="relative z-10 flex h-[calc(100vh-4rem)]">
        <Sidebar
          activeTab={activeTab}
          endpoints={endpoints}
          documentationPages={documentationPages}
          selectedEndpoint={selectedEndpoint}
          expandedFolders={expandedFolders}
          onTabChange={setActiveTab}
          onEndpointSelect={setSelectedEndpoint}
          onToggleFolder={toggleFolder}
          onAddEndpoint={handleAddEndpoint}
        />

        <div className="flex-1 flex">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'endpoints' && currentEndpoint ? (
              <EndpointDetails
                project={project}
                endpoint={currentEndpoint}
                requestView={requestView}
                exampleLang={exampleLang}
                selectedStatusCode={selectedStatusCode}
                onRequestViewChange={setRequestView}
                onExampleLangChange={setExampleLang}
                onStatusCodeChange={setSelectedStatusCode}
                onRunEndpoint={handleRunEndpoint}
              />
            ) : activeTab === 'endpoints' ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p>Select an endpoint to view its details</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Documentation</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 mb-6">
                      Welcome to the {project.name} documentation. This section contains additional information about your API.
                    </p>
                    {documentationPages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No documentation pages yet. Click &quot;Add page&quot; in the sidebar to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {documentationPages.map(page => (
                          <div key={page.id} className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                            <h3 className="font-semibold mb-2">{page.title}</h3>
                            <p className="text-gray-600 text-sm">
                              {page.content || 'No content available'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'documentation' && (
            <ActionsSidebar onOpenModal={openModal} />
          )}
        </div>
      </div>

      <ImportExport 
        isOpen={showModal}
        type={modalType}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}