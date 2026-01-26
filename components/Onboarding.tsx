import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, QrCode, Palette, Download, ShieldCheck } from './IconComponents';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome to LanQ",
    description: "The premium QR code generator that respects your privacy. Works 100% offline, directly in your browser.",
    icon: <ShieldCheck size={48} className="text-primary-500" />,
    color: "bg-primary-50 dark:bg-primary-900/20"
  },
  {
    title: "Input Anything",
    description: "Create QR codes for URLs, WiFi networks, vCards, and more using the smart input forms.",
    icon: <QrCode size={48} className="text-purple-500" />,
    color: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Design & Auto Blend",
    description: "Customize appearance manually or use 'Auto Blend' for intelligent, color-safe combinations instantly.",
    icon: <Palette size={48} className="text-pink-500" />,
    color: "bg-pink-50 dark:bg-pink-900/20"
  },
  {
    title: "Export High-Res",
    description: "Download print-ready SVG vectors or high-resolution PNGs. No accounts, no watermarks, no limits.",
    icon: <Download size={48} className="text-emerald-500" />,
    color: "bg-emerald-50 dark:bg-emerald-900/20"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center lg:items-center lg:p-0"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white dark:bg-black lg:bg-black/60 lg:backdrop-blur-md" />

      <motion.div 
        layoutId="onboarding-card"
        className="w-full h-full lg:h-auto lg:w-full lg:max-w-lg lg:rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-none lg:shadow-2xl relative flex flex-col justify-between overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        <div className="flex-1 flex flex-col p-6 sm:p-10">
          
          {/* Header Actions */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={onComplete}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              Skip
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full"
              >
                <motion.div 
                  layoutId="icon-container"
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-10 shadow-lg shadow-gray-200/50 dark:shadow-none ${STEPS[currentStep].color}`}
                >
                  {STEPS[currentStep].icon}
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base max-w-xs sm:max-w-sm mx-auto">
                  {STEPS[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-6 sm:p-10 pt-0 mt-auto">
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-neutral-800 pt-6">
            {/* Dots */}
            <div className="flex space-x-2.5">
              {STEPS.map((_, idx) => (
                <motion.div 
                  key={idx}
                  initial={false}
                  animate={{ 
                    width: idx === currentStep ? 24 : 8,
                    backgroundColor: idx === currentStep ? 'var(--color-primary-600)' : 'var(--color-gray-200)' 
                  }}
                  className="h-2 rounded-full transition-colors"
                  style={{ backgroundColor: idx === currentStep ? '#0284c7' : '#e5e7eb' }} // Fallback inline for safety
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="group flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary-500/30 active:scale-95"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentStep === STEPS.length - 1 ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;