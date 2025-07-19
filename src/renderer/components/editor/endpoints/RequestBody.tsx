import { Endpoint } from "../../../../main/database/schema";

interface RequestBodyProps {
  endpoint: Endpoint;
  requestView: string;
  onRequestViewChange: (view: string) => void;
}

export default function RequestBody({ endpoint, requestView, onRequestViewChange }: RequestBodyProps) {
  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200/30">
        <h3 className="font-medium text-white/60">Request Body</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRequestViewChange('form')}
            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
              requestView === 'form' 
              ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
              : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => onRequestViewChange('code')}
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
            defaultValue={endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : ''}
          />
        )}
      </div>
    </div>
  );
}