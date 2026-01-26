import React, { useState, useEffect } from 'react';
import { READY_MADE_TEMPLATES } from '../constants';
import { DesignState } from '../types';
import { generateAutoBlend } from '../utils/colorUtils';
import { saveBlendToDB, getBlendsFromDB } from '../utils/db.ts';
import { triggerHaptic } from '../utils/haptics';
import { Sparkles, Search, LayoutTemplate, Shuffle } from './IconComponents';
import BottomSheet from './BottomSheet';
import { motion } from 'framer-motion';

interface TemplatesPanelProps {
  onApply: (design: Partial<DesignState>) => void;
  currentDesign: DesignState;
}

const springConfig = { type: "spring" as const, stiffness: 300, damping: 25 };

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onApply, currentDesign }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentBlends, setRecentBlends] = useState<{fg: string, bg: string}[]>([]);

  useEffect(() => {
    const loadBlends = async () => {
      try {
        const blends = await getBlendsFromDB();
        setRecentBlends(blends);
      } catch (e) {
        console.error("Failed to load blends from DB", e);
      }
    };
    loadBlends();
  }, [currentDesign]); // Refresh when design changes to reflect new saves

  const handleAutoBlend = async () => {
    const { fg, bg } = generateAutoBlend();
    onApply({ fgColor: fg, bgColor: bg });
    await saveBlendToDB(fg, bg);
    
    // Refresh list
    const blends = await getBlendsFromDB();
    setRecentBlends(blends);
    triggerHaptic('medium');
  };

  const renderColorCard = (fg: string, bg: string, label: string) => {
    const isActive = currentDesign.fgColor === fg && currentDesign.bgColor === bg;
    return (
      <motion.button
        key={`${fg}-${bg}-${label}`}
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -5 }}
        onClick={() => { triggerHaptic('medium'); onApply({ fgColor: fg, bgColor: bg }); }}
        className={`relative group flex flex-col items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 ui-button ${
           isActive 
            ? 'bg-white dark:bg-neutral-800 border-primary-500 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-900 shadow-md' 
            : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:shadow-lg'
        }`}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-sm mb-3 relative overflow-hidden flex" style={{ backgroundColor: bg }}>
            <div className="w-full h-full flex items-center justify-center">
                 <div className="w-6 h-6 rounded-full" style={{ backgroundColor: fg }} />
            </div>
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 text-center truncate w-full">{label}</span>
      </motion.button>
    )
  }

  const renderTemplateCard = (template: typeof READY_MADE_TEMPLATES[0], compact = false) => {
    const isActive = currentDesign.fgColor === template.design.fgColor && currentDesign.bgColor === template.design.bgColor && currentDesign.shape === template.design.shape;
    return (
      <motion.button
        key={template.id}
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -5 }}
        onClick={() => { triggerHaptic('medium'); onApply(template.design); if (!compact) setIsSheetOpen(false); }}
        className={`relative group flex flex-col items-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 ui-button ${
          isActive 
            ? 'bg-white dark:bg-neutral-800 border-primary-500 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-900 shadow-md' 
            : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:shadow-lg'
        }`}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-sm mb-3 relative overflow-hidden flex items-center justify-center ring-1 ring-black/5" style={{ backgroundColor: template.design.bgColor }}>
           <div className={`w-6 h-6 sm:w-8 sm:h-8 ${template.design.shape === 'circle' ? 'rounded-full' : template.design.shape === 'rounded' ? 'rounded-md' : 'rounded-none'}`} style={{ backgroundColor: template.design.fgColor }}></div>
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 text-center truncate w-full">{template.name}</span>
        {isActive && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>}
      </motion.button>
    );
  };

  const filteredTemplates = READY_MADE_TEMPLATES.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = Array.from(new Set(filteredTemplates.map(t => t.category)));

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springConfig}>
       <div className="flex gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={handleAutoBlend} className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-4 rounded-2xl shadow-lg shadow-indigo-500/20 group ui-button">
            <Shuffle size={18} className="group-hover:rotate-180 transition-transform duration-500" /><span className="font-bold text-sm">Auto Blend</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={() => setIsSheetOpen(true)} className="px-6 flex flex-col items-center justify-center rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all ui-button">
             <LayoutTemplate size={20} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
       </div>

       <div className="mb-4">
         <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Featured Styles</h3>
         <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
           {recentBlends.length > 0 && recentBlends.slice(0, 4).map((blend, idx) => renderColorCard(blend.fg, blend.bg, `Recent ${idx + 1}`))}
           {READY_MADE_TEMPLATES.slice(0, 8 - (recentBlends.length > 0 ? Math.min(recentBlends.length, 4) : 0)).map((t) => renderTemplateCard(t, true))}
         </div>
       </div>

       <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Design Library">
          <div className="space-y-6 pb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ui-input w-full pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" autoFocus />
            </div>
            {filteredTemplates.length > 0 ? (
              categories.map(cat => {
                const catTemplates = filteredTemplates.filter(t => t.category === cat);
                if (catTemplates.length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm py-2 z-10">{cat}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">{catTemplates.map(t => renderTemplateCard(t))}</div>
                  </div>
                );
              })
            ) : (<div className="text-center py-12 text-gray-400"><p>No styles found matching "{searchQuery}"</p></div>)}
          </div>
       </BottomSheet>
    </motion.div>
  );
};

export default TemplatesPanel;