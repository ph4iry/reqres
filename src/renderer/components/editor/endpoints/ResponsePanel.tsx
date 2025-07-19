import { Play } from "lucide-react";
import { Project, Endpoint } from "../../../../main/database/schema";

interface ResponsePanelProps {
  project: Project;
  endpoint: Endpoint;
  onRunEndpoint: () => void;
}

export default function ResponsePanel({ project, endpoint, onRunEndpoint }: ResponsePanelProps) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <h3 className="font-medium text-gray-900">Response</h3>
        <button 
          onClick={onRunEndpoint}
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
            {project.baseUrl ? `${project.baseUrl}${endpoint.path}` : endpoint.path}
          </div>
        </div>
      </div>
    </div>
  );
}