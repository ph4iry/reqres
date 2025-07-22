import Button from "@components/ui/Button";
import { CurlyBraces, File, FlaskConical, Settings, Variable } from "lucide-react";

type TabType = 'params' | 'body' | 'tests' | 'docs' | 'settings'
export default function RequestTabs({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void}) {
  const toggle = (tab: TabType) => {
    const next = activeTab === tab ? 'params' : tab;
    setActiveTab(next);
  }

  return (
    <div className="w-full bg-white/5 rounded-full flex items-center gap-4 p-2">
      <Button icon={Variable} toggle active={activeTab === 'params'} onClick={() => toggle('params')}>Params</Button>
      <Button icon={CurlyBraces} toggle active={activeTab === 'body'} onClick={() => toggle('body')}>Body</Button>
      <Button icon={FlaskConical} toggle active={activeTab === 'tests'} onClick={() => toggle('tests')}>Tests</Button>
      <Button icon={File} toggle active={activeTab === 'docs'} onClick={() => toggle('docs')}>Docs</Button>
      <Button icon={Settings} toggle active={activeTab === 'settings'} onClick={() => toggle('settings')}>Settings</Button>
    </div>
  )
}