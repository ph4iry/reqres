import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";

interface EndpointAddButtonProps {
  children: ReactNode;
  handler: (path: string) => void;
}

export default function EndpointAddButton({ children, handler }: EndpointAddButtonProps) {
  const [pendingRoute, setPendingRoute] = useState('');
  const [stage, setStage] = useState<'create' | 'name'>('create');

  const handleTransformation = () => {
    if (stage === 'create') {
      setStage('name');
      document.getElementById('add-endpoint')!.focus();
    }
    if (stage === 'name') {
      if (!pendingRoute.startsWith('/')) {
        handler(`/${pendingRoute}`);
      } else {
        handler(pendingRoute);
      }
      setPendingRoute('');
      setStage('create');
    }
  };
  
  return (
    <div className="w-full flex items-center flex-nowrap">
      <input 
        id="add-endpoint" 
        onBlur={() => {
          if (stage === 'name' && !pendingRoute) {
            setStage('create');
          }
        }} 
        type="text" 
        onChange={(e) => setPendingRoute(e.target.value)} 
        className={`${stage === 'create' ? 'w-0' : 'w-full px-4 font-mono text-sm bg-white/5 py-2 rounded-xl border border-gray-200/50 focus:ring-2 focus:ring-white focus:border-transparent outline-none backdrop-blur-sm mr-2 text-white'} transition-all grow items-stretch h-12`} 
      />
      <button 
        onClick={handleTransformation} 
        className={`${stage === 'name' ? 'basis-6' : ''} shrink flex items-center justify-center gap-2 w-full px-3 h-12 text-left text-sm text-white/50 hover:text-white rounded-xl border border-gray-200/20 hover:border-gray-200/50 transition-all duration-200`}
      >
        <Plus size={16} />
        {stage === 'create' && children}
      </button>
    </div>
  );
}