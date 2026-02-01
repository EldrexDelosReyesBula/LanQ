import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import DesignPanel from './components/DesignPanel';
import TemplatesPanel from './components/TemplatesPanel';
import PreviewPanel from './components/PreviewPanel';
import SettingsSheet from './components/SettingsSheet';
import DonationSheet from './components/DonationSheet';
import BottomSheet from './components/BottomSheet';
import Onboarding from './components/Onboarding';
import { QrCode, Settings2, Type, LayoutTemplate } from './components/IconComponents';
import { QRState, DesignState, ThemeState } from './types';
import { DEFAULT_WIFI, DEFAULT_VCARD, DEFAULT_SMS, DEFAULT_CRYPTO, DEFAULT_SOCIAL, PRESETS } from './constants';
import { triggerHaptic } from './utils/haptics';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  // 1. Theme State (Liquid Glass only)
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem('lanq-theme');
      const defaultTheme: ThemeState = { mode: 'light', uiStyle: 'glass' };
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultTheme, mode: parsed.mode || 'light' };
      }
      return defaultTheme;
    } catch (e) {
      return { mode: 'light', uiStyle: 'glass' };
    }
  });

  // 2. Settings, PWA, & Onboarding State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Mobile Bottom Sheet State
  const [mobileSheet, setMobileSheet] = useState<'content' | 'templates' | 'design' | null>('content'); 

  // Check onboarding status on mount
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('lanq-onboarding-complete');
    if (!hasOnboarded) {
      setTimeout(() => setShowOnboarding(true), 500);
    } else {
      checkDonationTimer();
    }
  }, []);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('lanq-onboarding-complete', 'true');
    triggerHaptic('success');
    localStorage.setItem('lanq-last-donate-prompt', Date.now().toString());
  };

  const resetOnboarding = () => {
    localStorage.removeItem('lanq-onboarding-complete');
    setShowOnboarding(true);
  };

  // --- Donation Logic ---
  const DONATION_DAYS_INTERVAL = 5;
  const DOWNLOADS_INTERVAL = 10;

  const checkDonationTimer = () => {
    const lastPrompt = localStorage.getItem('lanq-last-donate-prompt');
    const now = Date.now();

    if (!lastPrompt) {
      localStorage.setItem('lanq-last-donate-prompt', now.toString());
      return;
    }

    const diffTime = Math.abs(now - parseInt(lastPrompt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays >= DONATION_DAYS_INTERVAL) {
      setTimeout(() => setIsDonationOpen(true), 1500);
      localStorage.setItem('lanq-last-donate-prompt', now.toString());
    }
  };

  const handleDownload = () => {
    const count = parseInt(localStorage.getItem('lanq-download-count') || '0') + 1;
    localStorage.setItem('lanq-download-count', count.toString());
    triggerHaptic('success');

    if (count % DOWNLOADS_INTERVAL === 0) {
      setTimeout(() => setIsDonationOpen(true), 500);
    }
  };

  const handleDonateAction = () => {
    window.open('https://ko-fi.com/landecsorg', '_blank');
    setIsDonationOpen(false);
  };

  // 3. Content State
  const [content, setContent] = useState<QRState>(() => {
    try {
      const saved = localStorage.getItem('lanq-content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          urlValue: parsed.urlValue || '',
          textValue: parsed.textValue || '',
          emailValue: parsed.emailValue || '',
          phoneValue: parsed.phoneValue || '',
          wifi: parsed.wifi || DEFAULT_WIFI,
          vcard: parsed.vcard || DEFAULT_VCARD,
          sms: parsed.sms || DEFAULT_SMS,
          crypto: parsed.crypto || DEFAULT_CRYPTO,
          social: parsed.social || DEFAULT_SOCIAL,
        };
      }
    } catch(e) {
       console.warn("Failed to parse saved content", e);
    }
    return {
      type: 'url',
      value: '',
      urlValue: '',
      textValue: '',
      emailValue: '',
      phoneValue: '',
      wifi: DEFAULT_WIFI,
      vcard: DEFAULT_VCARD,
      sms: DEFAULT_SMS,
      crypto: DEFAULT_CRYPTO,
      social: DEFAULT_SOCIAL,
    };
  });

  // 4. Design State
  const [design, setDesign] = useState<DesignState>(() => {
    try {
      const saved = localStorage.getItem('lanq-design');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          margin: parsed.margin !== undefined ? parsed.margin : 4,
          footerText: parsed.footerText || '',
        };
      }
    } catch(e) {
      console.warn("Failed to parse saved design", e);
    }
    return {
      fgColor: PRESETS.fgColor,
      bgColor: PRESETS.bgColor,
      shape: 'square',
      logo: null,
      logoSize: 0.15,
      margin: 4,
      errorCorrection: 'H',
      footerText: ''
    };
  });

  // Apply Theme Effect (Color Mode only)
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme.mode === 'dark' || (theme.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('lanq-theme', JSON.stringify(theme));
  }, [theme]);

  // Listen for system theme changes if mode is auto
  useEffect(() => {
    if (theme.mode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
       const root = window.document.documentElement;
       if (e.matches) root.classList.add('dark');
       else root.classList.remove('dark');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('lanq-content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('lanq-design', JSON.stringify(design));
  }, [design]);

  const handleThemeUpdate = (newTheme: Partial<ThemeState>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const handleContentChange = (newState: Partial<QRState>) => {
    setContent(prev => ({ ...prev, ...newState }));
  };

  const handleDesignChange = (newDesign: Partial<DesignState>) => {
    setDesign(prev => ({ ...prev, ...newDesign }));
  };

  const toggleMobileSheet = (sheet: typeof mobileSheet) => {
    triggerHaptic('medium');
    setMobileSheet(mobileSheet === sheet ? null : sheet);
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32 lg:pb-12">
        {/* Desktop Layout (Split View) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 md:gap-12">

          {/* Left Column: Input, Templates & Design */}
          <div className="lg:col-span-7 space-y-12">
            <section className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm font-bold mr-3 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800">1</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Content</h2>
              </div>
              <InputPanel state={content} onChange={handleContentChange} />
            </section>

             <section className="animate-slide-up" style={{ animationDelay: '50ms' }}>
              <div className="flex items-center mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm font-bold mr-3 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800">2</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Templates</h2>
              </div>
              <TemplatesPanel currentDesign={design} onApply={handleDesignChange} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-sm font-bold mr-3 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800">3</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Custom Design</h2>
              </div>
              <DesignPanel design={design} onChange={handleDesignChange} />
            </section>
          </div>

          {/* Right Column: Preview (Sticky) */}
          <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="lg:sticky lg:top-32">
              <PreviewPanel content={content} design={design} onDownload={handleDownload} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-[calc(100vh-6rem)]">
          <div className="flex-1 flex flex-col items-center justify-center pb-24">
             <motion.div layout className="w-full max-w-sm">
                <PreviewPanel content={content} design={design} onDownload={handleDownload} />
             </motion.div>
          </div>

          <div className="fixed bottom-6 left-4 right-4 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/60 border border-white/40 dark:border-white/10 p-2 z-40 flex justify-between items-center px-6">
            <button onClick={() => toggleMobileSheet('content')} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${mobileSheet === 'content' ? 'text-primary-600 bg-primary-100/50 dark:bg-primary-900/30 scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Type size={22} strokeWidth={mobileSheet === 'content' ? 2.5 : 2} />
              <span className="text-[9px] font-bold mt-1 tracking-wide">Input</span>
            </button>
             <button onClick={() => toggleMobileSheet('templates')} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${mobileSheet === 'templates' ? 'text-primary-600 bg-primary-100/50 dark:bg-primary-900/30 scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <LayoutTemplate size={22} strokeWidth={mobileSheet === 'templates' ? 2.5 : 2} />
              <span className="text-[9px] font-bold mt-1 tracking-wide">Templates</span>
            </button>
            <button onClick={() => toggleMobileSheet('design')} className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${mobileSheet === 'design' ? 'text-primary-600 bg-primary-100/50 dark:bg-primary-900/30 scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Settings2 size={22} strokeWidth={mobileSheet === 'design' ? 2.5 : 2} />
              <span className="text-[9px] font-bold mt-1 tracking-wide">Design</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Sheets */}
      <div className="lg:hidden">
          <BottomSheet isOpen={mobileSheet === 'content'} onClose={() => setMobileSheet(null)} title="Edit Content">
             <InputPanel state={content} onChange={handleContentChange} />
          </BottomSheet>
          <BottomSheet isOpen={mobileSheet === 'templates'} onClose={() => setMobileSheet(null)} title="Choose Template">
             <TemplatesPanel currentDesign={design} onApply={handleDesignChange} />
          </BottomSheet>
          <BottomSheet isOpen={mobileSheet === 'design'} onClose={() => setMobileSheet(null)} title="Customize Design">
             <DesignPanel design={design} onChange={handleDesignChange} />
          </BottomSheet>
      </div>

      <SettingsSheet 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeUpdate}
        onResetTutorial={resetOnboarding}
        onDonate={handleDonateAction}
        installApp={deferredPrompt ? handleInstallApp : null}
      />

      <DonationSheet isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} onDonate={handleDonateAction} />
      <AnimatePresence>{showOnboarding && <Onboarding onComplete={completeOnboarding} />}</AnimatePresence>
      <footer className="text-center py-8 text-xs text-gray-400 dark:text-neutral-600 hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
        <p>&copy; {new Date().getFullYear()} LanDecs. Built with precision.</p>
      </footer>
    </div>
  );
};

export default App;