import React, { useRef, useState, useEffect } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { DesignState, QRShape } from '../types';
import { ImageIcon, AlertTriangle, CheckCircle2, Shuffle, Sparkles, Trash2, Upload, Type, Grid3X3, Scaling } from './IconComponents';
import { getContrastRatio, generateAutoBlend } from '../utils/colorUtils';
import { MIN_CONTRAST_RATIO, COLOR_PALETTES } from '../constants';
import { triggerHaptic } from '../utils/haptics';

interface DesignPanelProps {
  design: DesignState;
  onChange: (newDesign: Partial<DesignState>) => void;
}

const springConfig = { type: "spring" as const, stiffness: 300, damping: 25 };
const fluidConfig = { type: "spring" as const, stiffness: 180, damping: 12, mass: 0.5 };

const DesignPanel: React.FC<DesignPanelProps> = ({ design, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentBlends, setRecentBlends] = useState<{fg: string, bg: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lanq-recent-blends');
      if (saved) setRecentBlends(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveBlend = (fg: string, bg: string) => {
    const newBlends = [{ fg, bg }, ...recentBlends].slice(0, 5);
    setRecentBlends(newBlends);
    localStorage.setItem('lanq-recent-blends', JSON.stringify(newBlends));
  };

  const handleAutoBlend = () => {
    const { fg, bg } = generateAutoBlend();
    // Simulate painting effect by animating the change
    onChange({ fgColor: fg, bgColor: bg });
    saveBlend(fg, bg);
    triggerHaptic('success');
  };

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) return alert("Image too large (Max 2MB).");
    if (!file.type.startsWith('image/')) return alert("Invalid file type.");
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ logo: ev.target?.result as string, errorCorrection: 'H' });
      triggerHaptic('heavy');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };

  const shapes: QRShape[] = ['square', 'rounded', 'circle', 'squircle', 'diamond', 'plus', 'triangle', 'pentagon'];
  const inputClass = "ui-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white placeholder-gray-400";

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springConfig}>
      
      {/* Colors Section */}
      <motion.div layout className="ui-panel p-6 hover:shadow-md transition-shadow duration-500">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Color Palette</h3>
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={handleAutoBlend} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 ui-button">
            <Shuffle size={16} /><span className="text-xs font-bold">Auto Blend</span>
          </motion.button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x scrollbar-hide">
            {recentBlends.length > 0 && (
               <>
                {recentBlends.map((blend, idx) => (
                  <motion.button key={`recent-${idx}`} whileTap={{ scale: 0.8 }} onClick={() => { onChange({ fgColor: blend.fg, bgColor: blend.bg }); triggerHaptic('selection'); }}
                    className="group flex-shrink-0 relative w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-indigo-100 dark:border-indigo-900 snap-center ui-button">
                     <div className="absolute inset-0 flex">
                      <div className="w-1/2 h-full" style={{ backgroundColor: blend.fg }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: blend.bg }} />
                    </div>
                  </motion.button>
                ))}
                <div className="w-[1px] h-8 bg-gray-200 dark:bg-neutral-700 self-center mx-2 flex-shrink-0" />
               </>
            )}
            {COLOR_PALETTES.map((palette) => (
              <motion.button key={palette.name} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => { onChange({ fgColor: palette.fg, bgColor: palette.bg }); triggerHaptic('selection'); }}
                className="group flex-shrink-0 relative w-12 h-12 rounded-full overflow-hidden shadow-sm transition-all snap-center ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-neutral-700 ui-button">
                <div className="absolute inset-0 flex transform group-hover:rotate-45 transition-transform duration-500">
                  <div className="w-1/2 h-full" style={{ backgroundColor: palette.fg }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: palette.bg }} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Foreground</label>
            <motion.div className="flex items-center space-x-3 ui-input p-2 group-focus-within:ring-4 group-focus-within:ring-primary-500/10 transition-all">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-600 shrink-0">
                <input type="color" className="absolute -top-4 -left-4 w-20 h-20 p-0 border-0 cursor-pointer" value={design.fgColor} onChange={(e) => onChange({ fgColor: e.target.value })} />
                <motion.div 
                  className="w-full h-full pointer-events-none" 
                  initial={false}
                  animate={{ backgroundColor: design.fgColor }}
                  transition={fluidConfig}
                />
              </div>
              <input type="text" value={design.fgColor} onChange={(e) => onChange({ fgColor: e.target.value })} className="bg-transparent text-sm font-mono font-medium text-gray-600 dark:text-gray-300 w-full focus:outline-none uppercase" />
            </motion.div>
          </div>
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Background</label>
             <motion.div className="flex items-center space-x-3 ui-input p-2 group-focus-within:ring-4 group-focus-within:ring-primary-500/10 transition-all">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-600 shrink-0">
                <input type="color" className="absolute -top-4 -left-4 w-20 h-20 p-0 border-0 cursor-pointer" value={design.bgColor} onChange={(e) => onChange({ bgColor: e.target.value })} />
                <motion.div 
                  className="w-full h-full pointer-events-none" 
                  initial={false}
                  animate={{ backgroundColor: design.bgColor }}
                  transition={fluidConfig}
                />
              </div>
               <input type="text" value={design.bgColor} onChange={(e) => onChange({ bgColor: e.target.value })} className="bg-transparent text-sm font-mono font-medium text-gray-600 dark:text-gray-300 w-full focus:outline-none uppercase" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Shapes & Logo Section */}
      <motion.div layout className="ui-panel p-6 hover:shadow-md transition-shadow duration-500">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Shape & Branding</h3>
        
        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Pixel Style</label>
          <LayoutGroup>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {shapes.map((s) => (
                <motion.button key={s} onClick={() => { onChange({ shape: s }); triggerHaptic('selection'); }}
                  className="relative py-3 rounded-xl flex flex-col items-center justify-center z-10 overflow-hidden ui-button aspect-square"
                  whileTap={{ scale: 0.95 }}>
                  {design.shape === s && (
                    <motion.div layoutId="activeShape" className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500 rounded-xl" />
                  )}
                  <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-2">
                     {/* Render CSS Shapes for preview */}
                    <div 
                        className={`w-full h-full bg-current text-gray-700 dark:text-gray-200 transition-all duration-300 ${s === 'triangle' || s === 'pentagon' ? '' : ''}`}
                        style={{
                            borderRadius: s === 'circle' ? '50%' : s === 'rounded' ? '4px' : s === 'squircle' ? '30%' : '0',
                            transform: s === 'diamond' ? 'rotate(45deg) scale(0.7)' : 'none',
                            clipPath: s === 'plus' 
                                ? 'polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%)' 
                                : s === 'triangle' 
                                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                : s === 'pentagon'
                                ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                                : 'none'
                        }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
           <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center"><Scaling size={14} className="mr-1.5" /> Logo Scale</label>
                 <span className="text-xs font-mono text-gray-400">{Math.round(design.logoSize * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="0.3" step="0.01" value={design.logoSize} onChange={(e) => { onChange({ logoSize: parseFloat(e.target.value) }); triggerHaptic('light'); }} className="w-full" disabled={!design.logo} />
           </div>
           <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center"><Grid3X3 size={14} className="mr-1.5" /> Margin</label>
                 <span className="text-xs font-mono text-gray-400">{design.margin}</span>
              </div>
              <input type="range" min="0" max="8" step="1" value={design.margin} onChange={(e) => { onChange({ margin: parseInt(e.target.value) }); triggerHaptic('light'); }} className="w-full" />
           </div>
        </div>

        {/* Logo Upload with Advanced Drag & Drop */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Logo Overlay</label>
          <div className="space-y-4">
            <motion.div 
               animate={{ 
                 borderColor: isDragging ? '#0ea5e9' : 'rgba(229, 231, 235, 0)',
                 backgroundColor: isDragging ? 'rgba(14, 165, 233, 0.05)' : 'rgba(255, 255, 255, 0)',
                 scale: isDragging ? 1.02 : 1
               }}
               transition={fluidConfig}
               onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
               className={`relative rounded-2xl border-2 border-dashed ${!isDragging && 'border-gray-200 dark:border-neutral-700'}`}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-1">
                    <AnimatePresence mode="popLayout">
                    {design.logo && (
                        <motion.div key="logo-preview" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={fluidConfig} className="relative w-16 h-16 rounded-xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-2 flex-shrink-0">
                        <img src={design.logo} alt="Logo" className="w-full h-full object-contain" />
                        <button onClick={() => { onChange({ logo: null }); triggerHaptic('medium'); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"><Trash2 size={12} /></button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => { fileInputRef.current?.click(); triggerHaptic('light'); }} className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 px-6 py-4 rounded-2xl text-sm font-semibold transition-all border-0 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 ui-button">
                        <ImageIcon size={20} /><span>{design.logo ? 'Replace Logo' : 'Upload Logo'}</span>
                    </motion.button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer Text */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Call to Action (Footer)</label>
           <div className="relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Type size={16} className="text-gray-400" /></div>
             <input type="text" placeholder="e.g., SCAN ME" value={design.footerText || ''} onChange={(e) => onChange({ footerText: e.target.value })} maxLength={20} className={`${inputClass} pl-10`} />
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesignPanel;