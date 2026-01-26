import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './BottomSheet';
import { ThemeState } from '../types';
import { 
  Moon, Sun, Monitor, FileText, ShieldCheck, Trash2, Info, ChevronRight,
  Palette, Heart, Coffee, Download, ArrowLeft, Zap, Link as LinkIcon
} from './IconComponents';
import { triggerHaptic } from '../utils/haptics';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeState;
  onThemeChange: (newTheme: Partial<ThemeState>) => void;
  onResetTutorial: () => void;
  onDonate: () => void;
  installApp: (() => void) | null;
}

const SettingsSheet: React.FC<SettingsSheetProps> = ({ 
  isOpen, onClose, theme, onThemeChange, onResetTutorial, onDonate, installApp
}) => {
  const [activeDoc, setActiveDoc] = useState<'tos' | 'privacy' | 'about' | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showResetConfirm && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showResetConfirm, countdown]);

  const handleResetClick = () => {
    setShowResetConfirm(true);
    setCountdown(5);
    triggerHaptic('warning');
  };

  const confirmReset = () => {
    onResetTutorial();
    setShowResetConfirm(false);
    onClose();
    triggerHaptic('success');
  };

  const renderThemeOption = (mode: 'light' | 'dark' | 'auto', Icon: any, label: string) => {
    const isActive = theme.mode === mode;
    return (
      <button
        onClick={() => { onThemeChange({ mode }); triggerHaptic('selection'); }}
        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ui-button ${
          isActive 
            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500 shadow-inner' 
            : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
        }`}
      >
        <Icon size={22} className="mb-2" />
        <span className="text-xs font-semibold">{label}</span>
      </button>
    );
  };

  const renderFullScreenDoc = () => {
    if (!activeDoc) return null;
    let title = '', content = null;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    switch (activeDoc) {
      case 'about':
        title = 'About LanQ';
        content = (
          <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
             <div className="flex flex-col items-center py-10">
                <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/20 mb-6 p-4 border border-gray-100 dark:border-neutral-700">
                   <img src="https://eldrex.landecs.org/squad/lanq-logo.png" alt="LanQ" className="w-full h-full object-contain" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">LanQ</h4>
                <p className="text-primary-600 dark:text-primary-400 font-medium mt-2 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full text-xs uppercase tracking-widest">Version 1.2.0</p>
             </div>
             
             <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
               <p className="text-lg font-medium leading-relaxed">LanQ is a premium, offline-first QR generator built by the LanDecs team. It demonstrates that powerful, feature-rich tools don't need cloud services, subscriptions, or tracking to be valuable.</p>
               
               <p className="leading-relaxed">
                 Traditional QR generators lock features behind paywalls, track scans, or expire codes. LanQ runs entirely in your browser—no servers, no analytics, no compromises.
               </p>

               <div className="space-y-3 mt-6">
                 <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Core Features</h5>
                 <ul className="list-disc pl-5 space-y-2">
                   <li><strong>Multi-Type QR Codes:</strong> WiFi, vCard, SMS, Email, Phone, Crypto addresses, and social media links—all in one app.</li>
                   <li><strong>Design & Customize:</strong> 6+ design presets, adjustable colors, borders, and corner radius for professional branding.</li>
                   <li><strong>Vector Exports:</strong> Infinite resolution SVG support for printing at any scale without quality loss.</li>
                   <li><strong>Template Library:</strong> Pre-built templates for quick QR code generation with common use cases.</li>
                 </ul>
               </div>

               <div className="space-y-3 mt-6">
                 <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Privacy & Control</h5>
                 <ul className="list-disc pl-5 space-y-2">
                   <li><strong>Local Processing:</strong> All data processing happens in your browser. Nothing leaves your device.</li>
                   <li><strong>Privacy First:</strong> Zero tracking pixels, analytics, or server logs of your QR codes.</li>
                   <li><strong>Works Offline:</strong> Install as a PWA and generate QR codes with no internet connection.</li>
                 </ul>
               </div>

               <div className="space-y-3 mt-6">
                 <h5 className="font-semibold text-gray-900 dark:text-white text-sm">Why LanQ?</h5>
                 <ul className="list-disc pl-5 space-y-2">
                   <li><strong>Built for Privacy:</strong> Your data never leaves your device. No tracking, no expiration, no limits.</li>
                   <li><strong>Completely Free:</strong> All premium features included. No hidden costs or feature lockouts.</li>
                   <li><strong>Always Available:</strong> Download as a PWA to use offline, anytime, anywhere.</li>
                   <li><strong>Professional Quality:</strong> Export as high-resolution SVG for print and digital use.</li>
                 </ul>
               </div>
               
               <div className="not-prose bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6 border border-gray-100 dark:border-neutral-700 mt-8 flex flex-col items-center text-center">
                  <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Design & Engineering</h5>
                  <a href="https://www.landecs.org" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold hover:text-primary-500 transition-colors bg-white dark:bg-neutral-700 px-5 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-600">
                      <span>Visit LanDecs</span><LinkIcon size={14} className="opacity-50" />
                  </a>
               </div>
             </div>
          </div>
        );
        break;
      case 'tos':
        title = 'Terms of Service';
        content = (
          <div className="max-w-2xl mx-auto prose dark:prose-invert prose-lg text-gray-600 dark:text-gray-300 space-y-8">
             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
               <p className="text-sm text-blue-900 dark:text-blue-100 m-0"><strong>TL;DR:</strong> Use LanQ however you want, free and forever. The QR codes you create are yours. We're not liable for misuse. That's it.</p>
             </div>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. License Grant</h4>
               <p>LanQ is provided free of charge for personal, educational, and commercial use. You may:</p>
               <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li>Generate unlimited QR codes</li>
                 <li>Export QR codes in any format (PNG, SVG, PDF)</li>
                 <li>Use QR codes for personal or commercial purposes</li>
                 <li>Modify, print, and distribute generated QR codes</li>
                 <li>Use LanQ on unlimited devices</li>
               </ul>
               <p className="mt-3"><strong>Attribution is not required.</strong> You may use LanQ and its generated QR codes without mentioning or crediting LanDecs.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Ownership</h4>
               <p>All QR codes generated using LanQ are your exclusive property. LanQ claims no ownership over the content you encode or the resulting QR codes. You are free to use them however you see fit.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. No Warranties</h4>
               <p>LanQ is provided "as-is" without warranty of any kind—express or implied. LanDecs does not warrant that:</p>
               <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li>The service will be uninterrupted or error-free</li>
                 <li>QR codes will scan correctly in all environments or readers</li>
                 <li>Generated codes will not become unreadable due to image corruption</li>
               </ul>
               <p className="mt-3 text-sm italic text-yellow-700 dark:text-yellow-200"><strong>Important:</strong> We strongly recommend testing all QR codes before mass production or deployment in critical systems.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. User Responsibility & Content</h4>
               <p>You are solely responsible for the content you encode into QR codes. LanQ:</p>
               <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li>Does not review, monitor, or moderate content</li>
                 <li>Does not store your inputs or generated codes</li>
                 <li>Cannot be held liable for illegal, offensive, or harmful content you encode</li>
                 <li>Cannot prevent misuse of your generated QR codes</li>
               </ul>
               <p className="mt-3">By using LanQ, you confirm that your QR codes comply with all applicable laws and do not infringe third-party rights.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Limitation of Liability</h4>
               <p>In no event shall LanDecs be liable for any indirect, incidental, special, consequential, or punitive damages arising from:</p>
               <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li>Use or inability to use LanQ</li>
                 <li>QR codes failing to scan correctly</li>
                 <li>Data loss, printing errors, or technical failures</li>
                 <li>Misuse of generated QR codes</li>
                 <li>Loss of revenue or business opportunity</li>
               </ul>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Third-Party Content</h4>
               <p>LanQ may link to external websites or CDNs (like esm.sh for dependencies). We are not responsible for the content, accuracy, or practices of these third parties. Use external links at your own risk.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Changes to Terms</h4>
               <p>LanDecs may update these terms at any time. Continued use of LanQ after updates constitutes acceptance of new terms. We recommend reviewing this page periodically.</p>
             </section>

             <section>
               <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Governing Law</h4>
               <p>These Terms of Service are governed by applicable law. Any disputes shall be resolved through negotiation or, if necessary, through appropriate legal channels.</p>
             </section>

             <div className="pt-8 border-t border-gray-100 dark:border-neutral-800"><p className="text-sm text-gray-400">Last updated: {dateStr}</p></div>
          </div>
        );
        break;
      case 'privacy':
        title = 'Privacy Policy';
        content = (
           <div className="max-w-2xl mx-auto prose dark:prose-invert prose-lg text-gray-600 dark:text-gray-300 space-y-8">
             <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-4">
               <ShieldCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" size={32} />
               <div><h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 m-0">Zero Knowledge</h3><p className="text-emerald-800 dark:text-emerald-200/80 text-sm mt-1 m-0">No servers. No tracking. No cookies. No accounts.</p></div>
             </div>
             
             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
               <p className="text-sm text-emerald-900 dark:text-emerald-100 m-0"><strong>TL;DR:</strong> All processing happens in your browser. We never see your data. We don't track you. Period.</p>
             </div>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Local Processing Only</h4>
                <p>LanQ operates entirely within your browser using client-side JavaScript. <strong>No data is transmitted to our servers.</strong> This means:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Your QR codes are generated locally on your device</li>
                  <li>Your input data (WiFi passwords, contact info, URLs, etc.) never leaves your browser</li>
                  <li>We have zero access to what you generate</li>
                  <li>Your data isn't stored, logged, or processed anywhere except your device</li>
                </ul>
                <p className="mt-3 text-sm italic text-emerald-700 dark:text-emerald-200">Even if we wanted to access your data, we couldn't—it never leaves your device.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Local Storage (On Your Device)</h4>
                <p>LanQ saves your preferences locally using your browser's <code>localStorage</code> API. This data:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Stays on your device</strong> and is not sent anywhere</li>
                  <li><strong>Is not accessible</strong> to other websites or apps</li>
                  <li><strong>Includes:</strong> Theme preference (light/dark), recent templates used, design customizations</li>
                  <li><strong>Can be cleared</strong> by clearing your browser cache or using "Clear Local Storage"</li>
                </ul>
                <p className="mt-3 text-sm">This data is saved to improve your experience between sessions. You can clear it anytime without affecting LanQ's functionality.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. No User Accounts</h4>
                <p>LanQ has no login system, no user accounts, and no user profiles. We don't collect:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Names or email addresses</li>
                  <li>Device information or identifiers</li>
                  <li>Browsing history or device usage patterns</li>
                  <li>Location data</li>
                  <li>Any personally identifiable information</li>
                </ul>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. No Tracking or Analytics</h4>
                <p>LanQ uses <strong>zero tracking tools.</strong> We don't use:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Google Analytics or similar tracking services</li>
                  <li>Cookies for analytics or behavioral tracking</li>
                  <li>Heatmap or user session recording tools</li>
                  <li>Ad networks or third-party advertising trackers</li>
                  <li>Crash reporting services that identify users</li>
                </ul>
                <p className="mt-3">We have no visibility into what you do with LanQ, and we don't want it.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Third-Party CDNs</h4>
                <p>LanQ is delivered via trusted CDNs (like esm.sh and cdn.tailwindcss.com) to ensure fast, reliable access. These providers:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>May see standard HTTP logs (IP address, User Agent, timestamp)</li>
                  <li><strong>Cannot see the content you generate</strong> (QR codes, input data)</li>
                  <li>Are industry-standard providers with strong privacy practices</li>
                </ul>
                <p className="mt-3 text-sm">HTTP logs are standard for all web traffic. They don't reveal your QR code content or personal data.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Offline Mode (PWA)</h4>
                <p>LanQ can be installed as a Progressive Web App (PWA) and works fully offline. When offline:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Zero network requests are made</li>
                  <li>All processing is entirely local</li>
                  <li>Your data is completely isolated</li>
                </ul>
                <p className="mt-3">Offline use is the ultimate privacy guarantee.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Open Source & Transparency</h4>
                <p>LanQ's code is open source and publicly available on GitHub. You can:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Review the source code to verify our privacy claims</li>
                  <li>Audit exactly what data is processed and where</li>
                  <li>Run LanQ yourself without relying on our hosted version</li>
                </ul>
                <p className="mt-3">Transparency is fundamental to privacy.</p>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Data You Share</h4>
                <p>If you contact us via email or feedback:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Your message is stored securely and only accessed by our team</li>
                  <li>We use your feedback only to improve LanQ</li>
                  <li>We will never share your email or feedback with third parties</li>
                  <li>You can request deletion of your message anytime</li>
                </ul>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Browser Security</h4>
                <p>Your privacy also depends on your browser's security:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Use HTTPS (which LanQ does) to encrypt data in transit</li>
                  <li>Keep your browser and OS updated</li>
                  <li>Use strong passwords for any accounts</li>
                  <li>Consider using a privacy-focused browser or VPN</li>
                </ul>
             </section>

             <section>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Changes to This Policy</h4>
                <p>We may update this privacy policy to reflect changes in our practices or applicable law. We'll notify you of material changes. Your continued use of LanQ signifies acceptance of the updated policy.</p>
             </section>

             <div className="pt-8 border-t border-gray-100 dark:border-neutral-800"><p className="text-sm text-gray-400">Last updated: {dateStr}</p></div>
          </div>
        );
        break;
    }
    return (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-0 z-[100] bg-[#f9fafb] dark:bg-[#050505] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-800">
           <button onClick={() => { triggerHaptic('medium'); setActiveDoc(null); }} className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 px-2 py-1"><ArrowLeft size={22} /><span className="text-base font-semibold">Settings</span></button>
           <h3 className="absolute left-1/2 -translate-x-1/2 font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
           <div className="w-16" />
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24">{content}</div>
      </motion.div>
    );
  };

  const menuButtonClass = "w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors border-b border-gray-100 dark:border-neutral-700/50 last:border-0 first:rounded-t-2xl last:rounded-b-2xl";

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title="Settings">
        <div className="relative pb-8">
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-center w-full max-w-xs bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
                    <Trash2 size={32} className="mx-auto mb-4 text-red-600" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reset App?</h4>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-neutral-700 rounded-xl font-semibold">Cancel</button>
                      <button onClick={confirmReset} disabled={countdown > 0} className={`flex-1 py-3 rounded-xl font-semibold text-white ${countdown > 0 ? 'bg-gray-400' : 'bg-red-600'}`}>{countdown > 0 ? `${countdown}s` : 'Reset'}</button>
                    </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <h4 className="font-bold text-xl mb-1 flex items-center">Support LanQ <Heart size={20} className="ml-2 text-rose-500 animate-pulse" /></h4>
               <p className="text-gray-400 text-xs font-medium mb-4">Offline. Ad-free. User-supported.</p>
               <div className="flex gap-3">
                <button onClick={() => { triggerHaptic('success'); onDonate(); onClose(); }} className="flex-1 bg-white text-gray-900 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"><Coffee size={18} /><span>Donate</span></button>
                {installApp && <button onClick={() => { triggerHaptic('success'); installApp(); onClose(); }} className="flex-1 bg-white/10 backdrop-blur-md text-white border border-white/10 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"><Download size={18} /><span>Install</span></button>}
               </div>
            </div>

            <section>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center"><Palette size={14} className="mr-2" /> Appearance</h4>
              <div className="flex gap-3 bg-gray-50/50 dark:bg-neutral-800/50 p-1.5 rounded-[1.25rem] mb-4 ui-input">
                {renderThemeOption('light', Sun, 'Light')}
                {renderThemeOption('dark', Moon, 'Dark')}
                {renderThemeOption('auto', Monitor, 'System')}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Legal & Info</h4>
              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-700/50 shadow-sm">
                <button onClick={() => setActiveDoc('about')} className={menuButtonClass}><span className="flex items-center"><Zap size={18} className="mr-3 text-orange-500" />About LanQ</span><ChevronRight size={16} /></button>
                <button onClick={() => setActiveDoc('tos')} className={menuButtonClass}><span className="flex items-center"><FileText size={18} className="mr-3 text-blue-500" />Terms of Service</span><ChevronRight size={16} /></button>
                <button onClick={() => setActiveDoc('privacy')} className={menuButtonClass}><span className="flex items-center"><ShieldCheck size={18} className="mr-3 text-emerald-500" />Privacy Policy</span><ChevronRight size={16} /></button>
              </div>
            </section>

            <button onClick={handleResetClick} className="w-full py-4 text-red-600 rounded-2xl border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors text-sm font-semibold flex items-center justify-center"><Trash2 size={16} className="mr-2" /> Reset App Preferences</button>
            <div className="text-center mt-6"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">LanQ v1.2.0</p></div>
          </div>
        </div>
      </BottomSheet>
      <AnimatePresence>{activeDoc && renderFullScreenDoc()}</AnimatePresence>
    </>
  );
};

export default SettingsSheet;
