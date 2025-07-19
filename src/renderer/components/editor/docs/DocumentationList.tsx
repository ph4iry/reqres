import { Plus, FileText } from "lucide-react";
import { Documentation } from "../../../../main/database/schema";

interface DocumentationListProps {
  documentationPages: Documentation[];
  onPageSelect?: (id: string) => void;
}

export default function DocumentationList({ documentationPages, onPageSelect }: DocumentationListProps) {
  if (documentationPages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-4">No documentation pages yet</p>
        <button className="flex items-center gap-2 w-full p-3 text-left text-sm text-gray-500 hover:bg-white/60 rounded-xl border-2 border-dashed border-gray-300 transition-all duration-200">
          <Plus size={16} />
          Add your first page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documentationPages.map(page => (
        <button
          key={page.id}
          onClick={() => onPageSelect?.(page.id)}
          className="flex items-center gap-2 w-full p-3 text-left text-sm text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200"
        >
          <FileText size={16} />
          {page.title}
        </button>
      ))}
    </div>
  );
}