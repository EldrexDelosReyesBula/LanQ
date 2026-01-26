import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from './IconComponents';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[70] flex justify-center pointer-events-none"
          >
            <div className="bg-white dark:bg-neutral-900 w-full md:w-auto md:min-w-[600px] md:max-w-3xl md:rounded-t-3xl md:bottom-0 md:mb-0 rounded-t-3xl shadow-2xl pointer-events-auto max-h-[85vh] flex flex-col">
              
              {/* Handle (Mobile) */}
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden" onClick={onClose}>
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title || 'Details'}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;