interface ModalProps {
  isOpen: boolean;
  type: string;
  onClose: () => void;
}

export default function ImportExport({ isOpen, type, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 w-96 border border-gray-200/50 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">
          {type === 'export' ? 'Export Documentation' : 'Import Documentation'}
        </h3>
        {type === 'export' ? (
          <div className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Export as PDF
            </button>
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Export as Markdown
            </button>
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Export as HTML
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Import from OpenAPI
            </button>
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Import from Postman
            </button>
            <button className="w-full p-3 text-left border border-gray-200/50 rounded-xl hover:bg-gray-50/80 transition-all duration-200">
              Import from File
            </button>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}