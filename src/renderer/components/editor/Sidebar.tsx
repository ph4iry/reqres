import TabNavigation from "./Tabs";
import EndpointsList from "./endpoints/EndpointsList";
import DocumentationList from "./docs/DocumentationList";
import { Endpoint, Documentation } from "@main/database/schema";

interface SidebarProps {
  activeTab: string;
  endpoints: Endpoint[];
  documentationPages: Documentation[];
  selectedEndpoint: string | null;
  expandedFolders: string[];
  onTabChange: (tab: string) => void;
  onEndpointSelect: (id: string) => void;
  onToggleFolder: (folder: string) => void;
  onAddEndpoint: (path: string) => void;
}

export default function Sidebar({
  activeTab,
  endpoints,
  documentationPages,
  selectedEndpoint,
  expandedFolders,
  onTabChange,
  onEndpointSelect,
  onToggleFolder,
  onAddEndpoint
}: SidebarProps) {
  return (
    <div className="w-80 backdrop-blur-xl border-r border-white/20 flex flex-col">
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'endpoints' && (
          <EndpointsList
            endpoints={endpoints}
            selectedEndpoint={selectedEndpoint}
            expandedFolders={expandedFolders}
            onEndpointSelect={onEndpointSelect}
            onToggleFolder={onToggleFolder}
            onAddEndpoint={onAddEndpoint}
          />
        )}

        {activeTab === 'documentation' && (
          <DocumentationList documentationPages={documentationPages} />
        )}
      </div>
    </div>
  );
}
