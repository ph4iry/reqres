import { Endpoint } from "@main/database/schema";

interface DocumentationPanelProps {
  endpoint: Endpoint;
}

export default function EndpointDocWriterPanel({ endpoint }: DocumentationPanelProps) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
      <div className="p-4 border-b border-gray-200/50">
        <h3 className="font-medium text-gray-900">Documentation</h3>
      </div>
      <div className="p-4">
        <textarea 
          className="w-full min-h-32 p-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Write detailed documentation for this endpoint..."
          defaultValue={endpoint.documentation || ''}
        />
      </div>
    </div>
  );
}