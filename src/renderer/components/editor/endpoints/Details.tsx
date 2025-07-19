'use client';
import RequestBadge from "./RequestBadge";
import { Project, Endpoint } from "../../../../main/database/schema";
import RequestTabs from "./RequestTabs";
import { useState } from "react";
import Params from "./tabs/Params";

interface EndpointDetailsProps {
  project: Project;
  endpoint: Endpoint;
  requestView: string;
  exampleLang: string;
  selectedStatusCode: string;
  onRequestViewChange: (view: string) => void;
  onExampleLangChange: (lang: string) => void;
  onStatusCodeChange: (code: string) => void;
  onRunEndpoint: () => void;
}

export default function EndpointDetails({
  project,
  endpoint,
  // requestView,
  // exampleLang,
  // selectedStatusCode,
  // onRequestViewChange,
  // onExampleLangChange,
  // onStatusCodeChange,
  // onRunEndpoint
}: EndpointDetailsProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'body' | 'tests' | 'settings'>('params');
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <RequestBadge method={endpoint.method} />
          <div className="flex bg-white/5 py-2 px-3 rounded-md font-mono text-white">
            <span className="text-white/40">{project.baseUrl}</span>
            <span className="text-white font-medium">{endpoint.path}</span>
            {endpoint.deprecated && (
              <span className="ml-2 text-red-500 text-sm font-semibold">Deprecated</span>
            )}
          </div>
        </div>
        <input 
          type="text" 
          value={endpoint.title}
          className="text-2xl font-bold mb-2 w-full border-0 outline-none focus:ring-0 bg-transparent placeholder-gray-400 text-white/70 hover:text-white focus:text-white"
          placeholder="Endpoint title"
          onChange={() => console.log('changed')}
        />
        <textarea 
          value={endpoint.description || ''}
          className="text-gray-600 w-full border-0 outline-none focus:ring-0 bg-transparent placeholder-gray-400 resize-none"
          placeholder="Endpoint description"
          rows={2}
          onChange={() => console.log('changed')}
        />
      </div>

      <RequestTabs {...{ activeTab, setActiveTab }} />

      {activeTab === 'params' && ( <Params project={project} endpointPath={endpoint.path} /> )}

      {/* Two Column Layout */}
      {/* <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <RequestBody 
            endpoint={endpoint}
            requestView={requestView}
            onRequestViewChange={onRequestViewChange}
          />
          <ResponsePanel 
            project={project}
            endpoint={endpoint}
            onRunEndpoint={onRunEndpoint}
          />
          <DocumentationPanel endpoint={endpoint} />
        </div>
        <div className="space-y-6">
          <RequestExample
            endpoint={endpoint}
            project={project}
            exampleLang={exampleLang}
            onExampleLangChange={onExampleLangChange}
          />
          <ResponseExample
            selectedStatusCode={selectedStatusCode}
            onStatusCodeChange={onStatusCodeChange}
          />
        </div>
      </div> */}
    </div>
  );
}