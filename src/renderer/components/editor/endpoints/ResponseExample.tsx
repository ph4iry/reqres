interface ResponseExampleProps {
  selectedStatusCode: string;
  onStatusCodeChange: (code: string) => void;
}

export default function ResponseExample({ selectedStatusCode, onStatusCodeChange }: ResponseExampleProps) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <h3 className="font-medium text-gray-900">Response Example</h3>
        <select 
          value={selectedStatusCode}
          onChange={(e) => onStatusCodeChange(e.target.value)}
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
  );
}