import { ArrowLeft, ChevronDown, ChevronRight, Copy, Download, FileText, Play, Plus, Settings, Trash2, Upload, History, Globe } from "lucide-react";
import { Project, Endpoint, Documentation } from "../../../main/database/schema";
import { ReactNode, useEffect, useState } from "react";
import RequestBadge from "./endpoints/RequestBadge";
import { apiClient } from "../../utils/api";
import Button from "components/ui/Button";

export default function EndpointEditor({ project }:{ project: Project }) {
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

  // Load data when project changes
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
      // Load endpoints for this project
      const endpointsResponse = await fetch(`http://localhost:3001/api/projects/${project.id}/endpoints`);
      if (endpointsResponse.ok) {
        const endpointsData = await endpointsResponse.json();
        setEndpoints(endpointsData.endpoints || []);
        
        // Auto-expand folders and select first endpoint
        const folders = [...new Set(endpointsData.endpoints?.map((e: Endpoint) => e.folder).filter(Boolean))] as string[];
        setExpandedFolders(folders);
        if (endpointsData.endpoints?.[0]) {
          setSelectedEndpoint(endpointsData.endpoints[0].id);
        }
      }

      // Load documentation pages
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

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const folder = endpoint.folder || 'General';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(endpoint);
    return acc;
  }, {} as Record<string, Endpoint[]>);

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
      // Construct the full URL
      const baseUrl = project.baseUrl || 'https://api.example.com';
      const fullUrl = `${baseUrl}${endpoint.path}`;
      
      const response = await fetch(fullUrl, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        // Add request body if it's not a GET request
        ...(endpoint.method !== 'GET' && endpoint.requestBody && {
          body: JSON.stringify(endpoint.requestBody)
        })
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      // You can update the response display here
      
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleAddEndpoint = async (path: string) => {
    const { endpoint } = await apiClient.createEndpoint(project.id, path);
    setEndpoints([
      ...endpoints,
      endpoint
    ]);
  }

  const ActionButton: React.FC<{
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    kbd: string;
    onClick: () => void;
  }> = ({ icon: Icon, label, kbd, onClick }) => (
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        {label}
      </div>
      <kbd className="px-2 py-1 text-xs bg-gray-100/80 rounded-lg font-mono">{kbd}</kbd>
    </button>
  );

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
      {/* Background gradient overlay*/}
      <div className="absolute inset-0 bg-gradient-to-br not-dark:from-blue-100/20 not-dark:via-transparent not-dark:to-purple-100/20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 h-16 bg-white/80 dark:bg-black/10 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.location.hash = ''}
            className="p-2 hover:bg-white/10 hover:text-white text-white/60 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bricolage font-bold text-gray-900 dark:text-white/70">{project.name}</h1>
            <p className="text-sm text-gray-500 dark:text-white/40">
              v{project.version}
              {project.baseUrl && <span> • {project.baseUrl}</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-nowrap">
          <Button icon={Settings}>Settings</Button>
          <Button icon={Globe}>Publish</Button>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 backdrop-blur-xl border-r border-white/20 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex mx-4 mt-4 gap-4">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'endpoints' 
                  ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
                  : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
              }`}
            >
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab('documentation')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'documentation' 
                  ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
                  : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
              }`}
            >
              Documentation
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'endpoints' && (
              <div className="space-y-2">
                {Object.entries(groupedEndpoints).length === 0 ? (
                  <div className="text-center py-8 text-white">
                    <p className="mb-4">No endpoints yet</p>
                    <EndpointAddButton handler={handleAddEndpoint}>Add your first endpoint</EndpointAddButton>
                  </div>
                ) : (
                  <>
                    {Object.entries(groupedEndpoints).map(([folder, folderEndpoints]) => (
                      <div key={folder} className="backdrop-blur-sm rounded-xl p-3 border border-gray-200/20">
                        <button
                          onClick={() => toggleFolder(folder)}
                          className="flex items-center gap-2 w-full p-2 text-left text-sm font-medium text-white hover:bg-white/60 rounded-lg transition-all duration-200"
                        >
                          {expandedFolders.includes(folder) ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                          <span className="capitalize">{folder}</span>
                        </button>
                        {expandedFolders.includes(folder) && (
                          <div className="mt-2 ml-2 space-y-1">
                            {folderEndpoints.map(endpoint => (
                              <button
                                key={endpoint.id}
                                onClick={() => setSelectedEndpoint(endpoint.id)}
                                className={`flex items-center gap-3 w-full p-3 text-left text-sm rounded-lg transition-all duration-200 ${
                                  selectedEndpoint === endpoint.id 
                                    ? 'text-white bg-white/5' 
                                    : 'text-white/55 transition hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <RequestBadge method={endpoint.method} />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{endpoint.title}</div>
                                  <div className="font-mono text-xs text-gray-500 truncate">{endpoint.path}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <EndpointAddButton handler={handleAddEndpoint}>Add an endpoint</EndpointAddButton>
                  </>
                )}
              </div>
            )}

            {activeTab === 'documentation' && (
              <div className="space-y-2">
                {documentationPages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No documentation pages yet</p>
                    <button className="flex items-center gap-2 w-full p-3 text-left text-sm text-gray-500 hover:bg-white/60 rounded-xl border-2 border-dashed border-gray-300 transition-all duration-200">
                      <Plus size={16} />
                      Add your first page
                    </button>
                  </div>
                ) : (
                  documentationPages.map(page => (
                    <button
                      key={page.id}
                      className="flex items-center gap-2 w-full p-3 text-left text-sm text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200"
                    >
                      <FileText size={16} />
                      {page.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'endpoints' && currentEndpoint ? (
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <RequestBadge method={currentEndpoint.method} />
                    <div className="flex bg-white/5 p-3 rounded-md font-mono text-white">
                      <span className="text-white/40">{project.baseUrl}</span>
                      <span className="text-white font-medium">{currentEndpoint.path}</span>
                      {currentEndpoint.deprecated && (
                        <span className="ml-2 text-red-500 text-sm font-semibold">Deprecated</span>
                      )}
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={currentEndpoint.title}
                    className="text-2xl font-bold mb-2 w-full border-0 outline-none focus:ring-0 bg-transparent placeholder-gray-400 text-white/70 hover:text-white focus:text-white"
                    placeholder="Endpoint title"
                    onChange={() => console.log('changed')}
                  />
                  <textarea 
                    value={currentEndpoint.description || ''}
                    className="text-gray-600 w-full border-0 outline-none focus:ring-0 bg-transparent placeholder-gray-400 resize-none"
                    placeholder="Endpoint description"
                    rows={2}
                    onChange={() => console.log('changed')}
                  />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Request & Response */}
                  <div className="space-y-6">
                    {/* Request Body */}
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/30">
                        <h3 className="font-medium text-white/60">Request Body</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRequestView('form')}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                              requestView === 'form' 
                              ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
                              : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
                            }`}
                          >
                            Form
                          </button>
                          <button
                            onClick={() => setRequestView('code')}
                            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                              requestView === 'code' 
                              ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
                              : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
                            }`}
                          >
                            Code
                          </button>
                        </div>
                      </div>
                      <div className="pt-4">
                        {requestView === 'form' ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="Parameter name" className="px-3 py-2 border-0 focus:ring-0 rounded bg-white/10 placeholder:text-white/40 text-white/70 focus:border-transparent outline-none" />
                              <select className="px-3 py-2 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                <option>string</option>
                                <option>number</option>
                                <option>boolean</option>
                              </select>
                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                Required
                              </label>
                            </div>
                            <textarea placeholder="Description" className="w-full px-3 py-2 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" rows={2} />
                          </div>
                        ) : (
                          <textarea 
                            className="w-full h-32 p-3 font-mono text-sm rounded-xl bg-black/50 backdrop-blur-sm text-white focus:ring-0 focus:border-transparent outline-none resize-y"
                            placeholder={`{\n  "example": "value"\n}`}
                            defaultValue={currentEndpoint.requestBody ? JSON.stringify(currentEndpoint.requestBody, null, 2) : ''}
                          />
                        )}
                      </div>
                    </div>

                    {/* Response */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                        <h3 className="font-medium text-gray-900">Response</h3>
                        <button 
                          onClick={handleRunEndpoint}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
                        >
                          <Play size={16} />
                          Run
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 font-mono text-sm border border-gray-200/50">
                          <div className="text-green-600 mb-2">Click &quot;Run&quot; to test this endpoint</div>
                          <div className="text-gray-500">
                            {project.baseUrl ? `${project.baseUrl}${currentEndpoint.path}` : currentEndpoint.path}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documentation */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-200/50">
                        <h3 className="font-medium text-gray-900">Documentation</h3>
                      </div>
                      <div className="p-4">
                        <textarea 
                          className="w-full min-h-32 p-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                          placeholder="Write detailed documentation for this endpoint..."
                          defaultValue={currentEndpoint.documentation || ''}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Examples */}
                  <div className="space-y-6">
                    {/* Request Example */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                        <h3 className="font-medium text-gray-900">Request Example</h3>
                        <select 
                          value={exampleLang}
                          onChange={(e) => setExampleLang(e.target.value)}
                          className="px-3 py-1 border border-gray-200/50 rounded-lg text-sm bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="curl">cURL</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="php">PHP</option>
                        </select>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-sm overflow-x-auto">
                          {exampleLang === 'curl' && `curl -X ${currentEndpoint.method} "${project.baseUrl || 'https://api.example.com'}${currentEndpoint.path}" \\
  -H "accept: application/json"`}
                          {exampleLang === 'javascript' && `fetch('${project.baseUrl || 'https://api.example.com'}${currentEndpoint.path}', {
  method: '${currentEndpoint.method}',
  headers: {
    'accept': 'application/json'
  }
});`}
                          {exampleLang === 'python' && `import requests

response = requests.${currentEndpoint.method.toLowerCase()}('${project.baseUrl || 'https://api.example.com'}${currentEndpoint.path}')
print(response.json())`}
                          {exampleLang === 'php' && `<?php
$response = file_get_contents('${project.baseUrl || 'https://api.example.com'}${currentEndpoint.path}');
echo $response;`}
                        </div>
                      </div>
                    </div>

                    {/* Response Example */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                        <h3 className="font-medium text-gray-900">Response Example</h3>
                        <select 
                          value={selectedStatusCode}
                          onChange={(e) => setSelectedStatusCode(e.target.value)}
                          className="px-3 py-1 border border-gray-200/50 rounded-lg text-sm bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="200">200 OK</option>
                          <option value="400">400 Bad Request</option>
                          <option value="404">404 Not Found</option>
                          <option value="500">500 Internal Server Error</option>
                        </select>
                      </div>
                      <div className="p-4">
                        <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 font-mono text-sm border border-gray-200/50">
                          <div className="text-gray-500 text-xs mb-2">Example response will appear here</div>
                          <div className="text-gray-400">
                            {`{
  "message": "Response data will be shown here"
}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

          {/* Right Sidebar - Actions */}
          {activeTab === 'documentation' && (
            <div className="w-64 bg-white/60 backdrop-blur-xl border-l border-gray-200/50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Actions</h3>
              <div className="space-y-1">
                <ActionButton icon={Copy} label="Copy Link" kbd="⌘L" onClick={() => {}} />
                <ActionButton icon={History} label="Page History" kbd="H" onClick={() => {}} />
                <ActionButton icon={Download} label="Export" kbd="⌘E" onClick={() => openModal('export')} />
                <ActionButton icon={Upload} label="Import" kbd="⌘I" onClick={() => openModal('import')} />
                <ActionButton icon={Trash2} label="Delete" kbd="⌘⌫" onClick={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 w-96 border border-gray-200/50 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'export' ? 'Export Documentation' : 'Import Documentation'}
            </h3>
            {modalType === 'export' ? (
              <div className="space-y-3">
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Export as PDF
                </button>
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Export as Markdown
                </button>
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Export as HTML
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Import from OpenAPI
                </button>
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Import from Postman
                </button>
                <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
                  Import from File
                </button>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EndpointAddButton({ children, handler }:{ children: ReactNode, handler: (s: string) => void }) {
  const [pendingRoute, setPendingRoute] = useState('');
  const [stage, setStage] = useState<'create' | 'name'>('create');
  // const input = useRef(null as HTMLInputElement | null);

  const handleTransformation = () => {
    if (stage === 'create') {
      setStage('name');
      document.getElementById('add-endpoint')!.focus();
    };
    if (stage === 'name') {
      if (!pendingRoute.startsWith('/')) {
        handler(`/${pendingRoute}`);
      } else {
        handler(pendingRoute);
      }
      setPendingRoute('');
      setStage('create');
    }
  }
  
  
  return (
    <div className="w-full flex items-center flex-nowrap">
      <input id="add-endpoint" onBlur={() => {
        if (stage === 'name' && !pendingRoute) {
          setStage('create');
        }
      }} type="text" onChange={(e) => setPendingRoute(e.target.value)} className={`${stage === 'create' ? 'w-0' : 'w-full px-4 font-mono text-sm bg-white/5 py-2 rounded-xl border border-gray-200/50 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm mr-2 text-white'} transition-all grow items-stretch h-12`} />
      <button onClick={handleTransformation} className={`${stage === 'name' ? 'basis-6' : ''} shrink flex items-center justify-center gap-2 w-full px-3 h-12 text-left text-sm text-white/50 hover:text-white rounded-xl border border-gray-200/20 hover:border-gray-200/50 transition-all duration-200`}>
        <Plus size={16} />
        {stage === 'create' && children}
      </button>
    </div>
  )
}