import { ArrowLeft } from "lucide-react";
import CreateProject from "../../../components/forms/CreateProject";

export default function NewProjectPage() {

  return (
    <div className="w-screen h-screen bg-gray-50">
      {/* topbar */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ArrowLeft className="size-5" />
          <div>
            <div className="text-xl font-bricolage font-bold">Create a new project</div>
            <div className="text-sm text-gray-600">Supercharge your API development</div>
          </div>
        </div>
        <a href="/projects" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-black hover:text-white transition">
          Cancel
        </a>
      </div>

      {/* form */}
      <div className="mt-6 w-full flex justify-center">
        <CreateProject />
      </div>
    </div>
  );
}