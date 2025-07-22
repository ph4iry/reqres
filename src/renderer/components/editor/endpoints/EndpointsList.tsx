import { ChevronDown, ChevronRight } from "lucide-react";
import { Endpoint } from "@main/database/schema";
import RequestBadge from "./RequestBadge";
import EndpointAddButton from "./EndpointAddButton";

interface EndpointsListProps {
  endpoints: Endpoint[];
  selectedEndpoint: string | null;
  expandedFolders: string[];
  onEndpointSelect: (id: string) => void;
  onToggleFolder: (folder: string) => void;
  onAddEndpoint: (path: string) => void;
}

export default function EndpointsList({
  endpoints,
  selectedEndpoint,
  expandedFolders,
  onEndpointSelect,
  onToggleFolder,
  onAddEndpoint
}: EndpointsListProps) {
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const folder = endpoint.folder || 'General';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(endpoint);
    return acc;
  }, {} as Record<string, Endpoint[]>);

  if (Object.entries(groupedEndpoints).length === 0) {
    return (
      <div className="text-center py-8 text-white">
        <p className="mb-4">No endpoints yet</p>
        <EndpointAddButton handler={onAddEndpoint}>Add your first endpoint</EndpointAddButton>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(groupedEndpoints).map(([folder, folderEndpoints]) => (
        <div key={folder} className="backdrop-blur-sm rounded-xl p-3 border border-gray-200/20">
          <button
            onClick={() => onToggleFolder(folder)}
            className="flex items-center gap-2 w-full p-2 text-left text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200"
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
                  onClick={() => onEndpointSelect(endpoint.id)}
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
      <EndpointAddButton handler={onAddEndpoint}>Add an endpoint</EndpointAddButton>
    </div>
  );
}