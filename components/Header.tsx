import React from 'react';
import { Settings2 } from './IconComponents';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-[#121212]/60 border-b border-gray-200/50 dark:border-white/5 transition-colors duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="relative w-8 h-8 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
             <img 
               src="https://eldrex.landecs.org/squad/lanq-logo.png" 
               alt="LanQ Logo" 
               className="w-full h-full object-contain drop-shadow-sm"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
             />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">LanQ</h1>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="p-2.5 rounded-full bg-gray-100/50 dark:bg-neutral-800/50 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 active:scale-90 shadow-sm"
          aria-label="Open Settings"
        >
          <Settings2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;