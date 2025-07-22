import { useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { Endpoint, Project } from "@main/database/schema"; // Adjust import path as needed

interface QueryParam {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

interface ParamsProps {
  project: Project;
  endpoint: Endpoint;
  responseState: [{ status: number, data: string } | null, (response: { status: number, data: string } | null) => void];
}

export default function Params({ project, endpoint, responseState }: ParamsProps) {
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [response, setResponse] = responseState;
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);

  const addQueryParam = () => {
    const newParam: QueryParam = {
      id: Date.now().toString(),
      key: '',
      value: '',
      description: '',
      enabled: true
    };
    setQueryParams([...queryParams, newParam]);
  };

  const removeQueryParam = (id: string) => {
    setQueryParams(queryParams.filter(param => param.id !== id));
  };

  const updateQueryParam = (id: string, field: keyof QueryParam, value: string | boolean) => {
    setQueryParams(queryParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const buildQueryString = () => {
    const enabledParams = queryParams.filter(param => param.enabled && param.key && param.value);
    if (enabledParams.length === 0) return '';
    
    const searchParams = new URLSearchParams();
    enabledParams.forEach(param => {
      searchParams.append(param.key, param.value);
    });
    return '?' + searchParams.toString();
  };

  const getFullUrl = () => {
    const baseUrl = project.baseUrl || 'https://api.example.com';
    const queryString = buildQueryString();
    return `${baseUrl}${endpoint.path}${queryString}`;
  };

  const determineErrorFormat: (message: string) => 'html' | 'json' | 'text' = (message) => {
    // if (!message) return 'text';
    try {
      JSON.parse(message);
      return 'json';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      if (/<[a-z][\s\S]*>/i.test(message)) {
        return 'html';
      }
      return 'text';
    }
  }

  const handleSendRequest = () => {
    const fullUrl = getFullUrl();
    // start timer
    const startTime = Date.now();
    fetch(fullUrl, {
      method: endpoint.method, // Adjust method as needed
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      // stop timer
      const endTime = Date.now();
      setDuration(endTime - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        const errorFormat = determineErrorFormat(errorText);

        if (errorFormat === 'json') {
          try {
            const jsonData = JSON.parse(errorText);
            setError({
              status: response.status,
              message: JSON.stringify(jsonData, null, 2)
            });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            setError({
              status: response.status,
              message: 'Invalid JSON response'
            });
          }
        } else if (errorFormat === 'html') {
          setError({
            status: response.status,
            message: `<div class="text-red-500">${errorText}</div>`
          });
        }
        // setError({
        //   status: response.status,
        //   message: errorText || 'An error occurred while fetching the response.'
        // });
        setResponse(null);
        return;
      }
      setResponse({
        status: response.status,
        data: JSON.stringify(await response.json(), null, 2)
      });
    });
    // onSendRequest?.(fullUrl, queryParams.filter(p => p.enabled));
  };

  return (
    <div className="w-full p-4 space-y-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60 font-medium">Query Params</div>
        <button
          onClick={addQueryParam}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all duration-200"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Parameters Table */}
      {queryParams.length > 0 && (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-white/10 text-xs font-medium text-white/40 uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-3">Key</div>
            <div className="col-span-3">Value</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1"></div>
          </div>
          
          <div className="space-y-2">
            {queryParams.map((param) => (
              <div key={param.id} className="grid grid-cols-12 gap-2 items-center group">
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => updateQueryParam(param.id, 'enabled', e.target.checked)}
                    className="w-3 h-3 text-blue-600 rounded border-white/20 bg-white/5 focus:ring-blue-500 focus:ring-1"
                  />
                </div>
                
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder="key"
                    value={param.key}
                    onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white/5 border border-white/10 rounded text-white/80 placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>
                
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder="value"
                    value={param.value}
                    onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white/5 border border-white/10 rounded text-white/80 placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>
                
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="description (optional)"
                    value={param.description}
                    onChange={(e) => updateQueryParam(param.id, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white/5 border border-white/10 rounded text-white/80 placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 focus:outline-none"
                  />
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeQueryParam(param.id)}
                    className="p-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {queryParams.length === 0 && (
        <div className="text-center py-6">
          <div className="text-white/50 text-xs mb-3">No query parameters yet</div>
          <button
            onClick={addQueryParam}
            className="flex items-center gap-2 mx-auto px-3 py-2 text-xs bg-white/5 text-white/60 rounded-lg hover:bg-white/10 hover:text-white/80 transition-all duration-200 border border-dashed border-white/20"
          >
            <Plus size={12} />
            Add your first parameter
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs text-white/40 font-medium">Preview</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 min-h-[32px] flex items-center">
            <code className="text-sm font-mono text-white/70 break-all">
              {getFullUrl()}
            </code>
          </div>
          <button
            onClick={handleSendRequest}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-all duration-200 text-sm font-medium shrink-0"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>

      <div className="">
        <div className="text-sm text-white/40 font-medium">Response</div>
        <div className="flex items-center gap-2 text-sm text-white/50 mt-3">
          {(response || error) && (
            // status code
            <div className="">
              {response ? (
                <span className="bg-green-500/30 px-2 py-1 rounded">{response?.status}</span>
              ) : (
                <span className="bg-red-500/30 px-2 py-1 rounded">{error?.status}</span>
              )}
            </div>
          )}
          <span className="text-white/30">&middot;</span>
          {duration !== null && (
            <div className="bg-white/5 px-2 py-1 rounded">
              {duration} ms
            </div>
          )}
        </div>
        <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70">
          {response ? (
            <pre className="whitespace-pre-wrap break-words">{response.data}</pre>
          ) : (
            error && <ErrorMessage format={determineErrorFormat(error.message)} message={error.message} />
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ format, message }: { format: 'html' | 'json' | 'text', message: string }) {
  return (
    <div>
      {format === 'html' ? (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      ) : format === 'json' ? (
        <pre>{JSON.stringify(JSON.parse(message), null, 2)}</pre>
      ) : (
        <pre>{message}</pre>
      )}
    </div>
  )
}