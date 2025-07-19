'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiClient } from "../../utils/api";

export default function CreateProject() {
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    baseUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('project-', '')]: value
    }));
  }

  const handleSubmit = async () => {
    console.log('handling submit')
    if (!formData.name.trim()) {
      alert('Project name cannot be empty');
      return;
    }

    // setLoading(true);
    try {
      const response = await apiClient.createProject({
        name: formData.name.trim(),
        description: formData.description || undefined,
        version: formData.version || '1.0.0',
        baseUrl: formData.baseUrl || '',
      });

      console.log(response);

      router.push(`/projects`);
    } catch (err) { alert('failed to create project: ' + err) } // finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl w-full bg-white p-8 rounded-xl border border-gray-200">
      <div className="space-y-8">
        <div>
          <input type="text" name="" id="project-name" onChange={handleInputChange} placeholder="Project Name" className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent focus:ring-0 p-0" />
        </div>
    
        <div>
          <textarea name="" id="project-description" onChange={handleInputChange} rows={2} placeholder="Describe your API..." className="w-full text-lg text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent focus:ring-0 p-0"></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input type="text" name="" id="project-version" onChange={handleInputChange} placeholder="1.0.0" className="w-full text-lg text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
            <input type="text" name="" id="project-baseUrl" onChange={handleInputChange} placeholder="https://api.example.com" className="w-full text-lg text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div className="-mt-4 text-sm text-gray-500">
          Calls to your API will look like: <code className="bg-gray-100 p-1 rounded">https://api.example.com/ping</code>! Don&apos;t worry, you can change this for production.
        </div>
    
        <button onClick={handleSubmit} type="button" className="bg-black w-full text-white text-lg text-center rounded-lg px-6 py-3  transition relative z-50">Create Project</button>
      </div>
    </div>
  )
}