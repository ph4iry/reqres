import { Copy, Download, Upload, History, Trash2 } from "lucide-react";

interface ActionButton {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  kbd: string;
  onClick: () => void;
}

interface ActionsSidebarProps {
  onOpenModal: (type: string) => void;
}

export default function ActionsSidebar({ onOpenModal }: ActionsSidebarProps) {
  const ActionButton: React.FC<ActionButton> = ({ icon: Icon, label, kbd, onClick }) => (
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        {label}
      </div>
      <kbd className="px-2 py-1 text-xs bg-gray-100/80 rounded-lg font-mono">{kbd}</kbd>
    </button>
  );

  return (
    <div className="w-64 bg-white/60 backdrop-blur-xl border-l border-gray-200/50 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Actions</h3>
      <div className="space-y-1">
        <ActionButton icon={Copy} label="Copy Link" kbd="⌘L" onClick={() => {}} />
        <ActionButton icon={History} label="Page History" kbd="H" onClick={() => {}} />
        <ActionButton icon={Download} label="Export" kbd="⌘E" onClick={() => onOpenModal('export')} />
        <ActionButton icon={Upload} label="Import" kbd="⌘I" onClick={() => onOpenModal('import')} />
        <ActionButton icon={Trash2} label="Delete" kbd="⌘⌫" onClick={() => {}} />
      </div>
    </div>
  );
}