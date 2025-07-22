import { Endpoint, Project } from "@main/database/schema";

interface RequestExampleProps {
  endpoint: Endpoint;
  project: Project;
  exampleLang: string;
  onExampleLangChange: (lang: string) => void;
}

export default function RequestExample({ endpoint, project, exampleLang, onExampleLangChange }: RequestExampleProps) {
  const getExampleCode = () => {
    switch (exampleLang) {
      case 'curl':
        return `curl -X ${endpoint.method} "${project.baseUrl || 'https://api.example.com'}${endpoint.path}" \\
  -H "accept: application/json"`;
      case 'javascript':
        return `fetch('${project.baseUrl || 'https://api.example.com'}${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'accept': 'application/json'
  }
});`;
      case 'python':
        return `import requests

response = requests.${endpoint.method.toLowerCase()}('${project.baseUrl || 'https://api.example.com'}${endpoint.path}')
print(response.json())`;
      case 'php':
        return `<?php
$response = file_get_contents('${project.baseUrl || 'https://api.example.com'}${endpoint.path}');
echo $response;`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <h3 className="font-medium text-gray-900">Request Example</h3>
        <select 
          value={exampleLang}
          onChange={(e) => onExampleLangChange(e.target.value)}
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
          {getExampleCode()}
        </div>
      </div>
    </div>
  );
}