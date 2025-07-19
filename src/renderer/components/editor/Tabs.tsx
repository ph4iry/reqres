interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex mx-4 mt-4 gap-4">
      <button
        onClick={() => onTabChange('endpoints')}
        className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          activeTab === 'endpoints' 
            ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
            : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
        }`}
      >
        Endpoints
      </button>
      <button
        onClick={() => onTabChange('documentation')}
        className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          activeTab === 'documentation' 
            ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' 
            : 'text-black hover:bg-black/50 dark:text-white dark:hover:bg-white/10'
        }`}
      >
        Documentation
      </button>
    </div>
  );
}