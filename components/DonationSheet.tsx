import React from 'react';
import { motion } from 'framer-motion';
import BottomSheet from './BottomSheet';
import { Coffee, Heart, Sparkles, X } from './IconComponents';

interface DonationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: () => void;
}

const DonationSheet: React.FC<DonationSheetProps> = ({ isOpen, onClose, onDonate }) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="relative pb-8 pt-2 text-center">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30 mb-6 rotate-3">
          <Heart className="text-white fill-white" size={32} />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Enjoying LanQ?
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
          LanQ is free, private, and offline. We don't run ads or track your data. If you've created value with our tool, consider buying us a coffee!
        </p>

        <div className="space-y-3">
          <button
            onClick={onDonate}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center space-x-2"
          >
            <Coffee size={20} />
            <span>Buy us a Coffee</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm"
          >
            Maybe later
          </button>
        </div>
        
        <p className="text-xs text-gray-400 dark:text-neutral-600 mt-6">
          Your support keeps the updates coming. Thank you!
        </p>
      </div>
    </BottomSheet>
  );
};

export default DonationSheet;