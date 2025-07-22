import { ArrowLeft, Settings, Globe } from "lucide-react";
import { Project } from "@main/database/schema";
import Button from "../ui/Button";

interface HeaderProps {
  project: Project;
  onBack: () => void;
}

export default function Header({ project, onBack }: HeaderProps) {
  return (
    <div className="relative z-10 h-16 bg-white/80 dark:bg-black/10 backdrop-blur-xl border-b border-gray-200/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack}
          toggle={false}
          className="p-2 hover:bg-white/10 hover:text-white text-white/60 rounded-xl transition-all duration-200"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bricolage font-bold text-gray-900 dark:text-white/70">{project.name}</h1>
          <p className="text-sm text-gray-500 dark:text-white/40">
            v{project.version}
            {project.baseUrl && <span> • {project.baseUrl}</span>}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-nowrap">
        <Button toggle={false} icon={Settings}>Settings</Button>
        <Button toggle={false} icon={Globe}>Publish</Button>
      </div>
    </div>
  );
}
