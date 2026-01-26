import React, { useEffect, useState } from 'react';
import { QRState, QRContentCheck, SocialConfig } from '../types';
import { 
  Link, Type, Wifi, Mail, Phone, Contact, Copy, CheckCircle2, 
  MessageSquare, Bitcoin, Twitter, Facebook, Smartphone, FileText,
  Calendar, Video, Ticket, Star, MessageCircle, ScanBarcode, Store, Briefcase,
  Search, Instagram, Linkedin, Youtube, Music, ImageIcon, Info, Share2
} from './IconComponents';
import { triggerHaptic } from '../utils/haptics';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_SMS, DEFAULT_CRYPTO, DEFAULT_SOCIAL, DEFAULT_EVENT, DEFAULT_COUPON, DEFAULT_FEEDBACK, DEFAULT_VCARD } from '../constants';

interface InputPanelProps {
  state: QRState;
  onChange: (newState: Partial<QRState>) => void;
}

const springConfig = { type: "spring" as const, stiffness: 350, damping: 25 };

const InputPanel: React.FC<InputPanelProps> = ({ state, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Update the raw value string based on structured data changes
  useEffect(() => {
    let newValue = '';
    
    // Helper accessors
    const getEvent = () => state.event || DEFAULT_EVENT;
    const getCoupon = () => state.coupon || DEFAULT_COUPON;
    const getFeedback = () => state.feedback || DEFAULT_FEEDBACK;
    const getVCard = () => state.vcard || DEFAULT_VCARD;

    switch (state.type) {
      case 'url':
      case 'pdf':
      case 'mp3':
      case 'images':
      case 'video':
      case 'app':
      case 'business':
        newValue = state.urlValue;
        break;
      case 'text':
      case 'barcode':
        newValue = state.textValue;
        break;
      case 'email':
        newValue = state.emailValue ? `mailto:${state.emailValue}` : '';
        break;
      case 'phone':
        newValue = state.phoneValue ? `tel:${state.phoneValue}` : '';
        break;
      case 'sms':
        const sms = state.sms || DEFAULT_SMS;
        newValue = sms.phone ? `SMSTO:${sms.phone}:${sms.message}` : '';
        break;
      case 'wifi':
        const { ssid, password, encryption, hidden } = state.wifi;
        newValue = `WIFI:S:${ssid};T:${encryption};P:${password};${hidden ? 'H:true;' : ''};`;
        break;
      case 'vcard':
        const v = getVCard();
        newValue = `BEGIN:VCARD\nVERSION:3.0\nN:${v.lastName};${v.firstName}\nFN:${v.firstName} ${v.lastName}\nORG:${v.org}\nTITLE:${v.title}\nTEL:${v.phone}\nEMAIL:${v.email}\nURL:${v.url}\nEND:VCARD`;
        break;
      case 'crypto':
        const crypto = state.crypto || DEFAULT_CRYPTO;
        if (crypto.coin === 'BTC') {
           newValue = `bitcoin:${crypto.address}${crypto.amount ? `?amount=${crypto.amount}` : ''}`;
        } else {
           newValue = `ethereum:${crypto.address}${crypto.amount ? `?amount=${crypto.amount}` : ''}`;
        }
        break;
      case 'social':
         const social = state.social || DEFAULT_SOCIAL;
         const { platform, username } = social;
         switch(platform) {
            case 'twitter': newValue = `https://twitter.com/${username}`; break;
            case 'facebook': newValue = `https://facebook.com/${username}`; break;
            case 'instagram': newValue = `https://instagram.com/${username}`; break;
            case 'linkedin': newValue = `https://linkedin.com/in/${username}`; break;
            case 'youtube': newValue = `https://youtube.com/@${username}`; break;
            default: newValue = username;
         }
         break;
      case 'event':
        const evt = getEvent();
        const formatTime = (iso: string) => iso.replace(/[-:]/g, '').split('.')[0] + 'Z'; 
        newValue = `BEGIN:VEVENT\nSUMMARY:${evt.title}\nLOCATION:${evt.location}\nDESCRIPTION:${evt.description}\nDTSTART:${evt.startDate ? formatTime(evt.startDate) : ''}\nDTEND:${evt.endDate ? formatTime(evt.endDate) : ''}\nEND:VEVENT`;
        break;
      case 'coupon':
        const cpn = getCoupon();
        newValue = `COUPON:${cpn.code};DISCOUNT:${cpn.discount};ITEM:${cpn.item}`;
        break;
      case 'feedback':
        const fb = getFeedback();
        newValue = `mailto:${fb.email}?subject=${encodeURIComponent(fb.subject)}&body=${encodeURIComponent(fb.body)}`;
        break;
      default:
        newValue = '';
    }
    
    if (newValue !== state.value) {
      onChange({ value: newValue });
    }
  }, [state, onChange]);

  const handleCopyText = async () => {
    if (!state.textValue) return;
    try {
      await navigator.clipboard.writeText(state.textValue);
      setCopied(true);
      triggerHaptic('success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      triggerHaptic('error');
    }
  };

  const tabs: { id: QRContentCheck; icon: React.ReactNode; label: string; keywords: string }[] = [
    { id: 'url', icon: <Link size={20} />, label: 'URL / Link', keywords: 'website link http' },
    { id: 'social', icon: <Share2 size={20} />, label: 'Social', keywords: 'social x facebook instagram twitter' },
    { id: 'wifi', icon: <Wifi size={20} />, label: 'WiFi', keywords: 'internet network password' },
    { id: 'vcard', icon: <Contact size={20} />, label: 'vCard Plus', keywords: 'contact person card' },
    { id: 'text', icon: <Type size={20} />, label: 'Text', keywords: 'plain writing note' },
    { id: 'email', icon: <Mail size={20} />, label: 'E-mail', keywords: 'mail send' },
    { id: 'sms', icon: <MessageSquare size={20} />, label: 'SMS', keywords: 'text message phone' },
    { id: 'crypto', icon: <Bitcoin size={20} />, label: 'Crypto', keywords: 'bitcoin ethereum wallet' },
    { id: 'pdf', icon: <FileText size={20} />, label: 'PDF', keywords: 'file document' },
    { id: 'mp3', icon: <Music size={20} />, label: 'MP3', keywords: 'audio music song' },
    { id: 'app', icon: <Store size={20} />, label: 'App Stores', keywords: 'play store apple' },
    { id: 'images', icon: <ImageIcon size={20} />, label: 'Images', keywords: 'photo gallery picture' },
    { id: 'barcode', icon: <ScanBarcode size={20} />, label: 'Barcode', keywords: 'gs1 datamatrix 2d' },
    { id: 'event', icon: <Calendar size={20} />, label: 'Event', keywords: 'date meeting invite' },
    { id: 'video', icon: <Video size={20} />, label: 'Video', keywords: 'movie youtube clip' },
    { id: 'business', icon: <Briefcase size={20} />, label: 'Business', keywords: 'company page work' },
    { id: 'coupon', icon: <Ticket size={20} />, label: 'Coupons', keywords: 'discount sale deal' },
    { id: 'feedback', icon: <MessageCircle size={20} />, label: 'Feedback', keywords: 'rating comment' },
    { id: 'phone', icon: <Phone size={20} />, label: 'Phone', keywords: 'call number' },
  ];

  const filteredTabs = tabs.filter(t => 
    t.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.keywords.includes(searchTerm.toLowerCase())
  );

  const inputClass = "ui-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1";
  const getSMS = () => state.sms || DEFAULT_SMS;
  const getCrypto = () => state.crypto || DEFAULT_CRYPTO;
  const getSocial = () => state.social || DEFAULT_SOCIAL;
  const getEvent = () => state.event || DEFAULT_EVENT;
  const getCoupon = () => state.coupon || DEFAULT_COUPON;
  const getFeedback = () => state.feedback || DEFAULT_FEEDBACK;
  const getVCard = () => state.vcard || DEFAULT_VCARD;

  const activeTabLabel = tabs.find(t => t.id === state.type)?.label || 'QR Code';

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springConfig}>
      
      {/* Search Bar */}
      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
         <input 
           type="text" 
           placeholder="Search type..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="ui-input w-full pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
         />
      </div>

      {/* Grid Selector */}
      <motion.div layout className="ui-input p-2 !bg-gray-100/50 dark:!bg-neutral-800/50">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence>
            {filteredTabs.map((tab) => {
              const isActive = state.type === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onChange({ type: tab.id }); triggerHaptic('selection'); }}
                  className={`flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ui-button ${
                    isActive
                      ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-md ring-1 ring-black/5 dark:ring-white/5'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-neutral-700/50'
                  }`}
                >
                  <motion.div>{tab.icon}</motion.div>
                  <span className="text-[10px] font-medium mt-1.5 text-center px-1 leading-tight">{tab.label}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex items-center space-x-2 px-2">
         <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTabLabel}</span>
      </div>

      {/* Dynamic Form Panel */}
      <motion.div layout transition={springConfig} className="ui-panel p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-bl-full pointer-events-none" />

        {(['url', 'pdf', 'mp3', 'images', 'video', 'app', 'business'].includes(state.type)) && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig}>
            <label className={labelClass}>
              {state.type === 'url' ? 'Website URL' : 
               state.type === 'pdf' ? 'Link to PDF' :
               state.type === 'mp3' ? 'Link to Audio' :
               state.type === 'video' ? 'Video Link' :
               'Content Link'}
            </label>
            <input type="url" placeholder="https://" className={inputClass} value={state.urlValue} onChange={(e) => onChange({ urlValue: e.target.value })} autoFocus />
            <p className="text-[10px] text-gray-400 mt-2 ml-1 flex items-start">
               <Info size={12} className="mr-1 mt-0.5 shrink-0" />
               Works offline. Please provide direct links.
            </p>
          </motion.div>
        )}

        {state.type === 'social' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
             <div>
               <label className={labelClass}>Platform</label>
               <div className="grid grid-cols-3 gap-2">
                  {['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'custom'].map((p) => (
                    <button key={p} onClick={() => onChange({ social: { ...getSocial(), platform: p as any } })} 
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-colors border ${getSocial().platform === p ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'border-gray-200 dark:border-neutral-700 text-gray-500'}`}>
                      {p}
                    </button>
                  ))}
               </div>
             </div>
             <div>
               <label className={labelClass}>Username / Handle</label>
               <div className="relative">
                 <span className="absolute left-4 top-3 text-gray-400">@</span>
                 <input type="text" className={`${inputClass} pl-8`} value={getSocial().username} onChange={(e) => onChange({ social: { ...getSocial(), username: e.target.value } })} />
               </div>
             </div>
          </motion.div>
        )}

        {(state.type === 'text' || state.type === 'barcode') && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="relative">
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className={labelClass}>{state.type === 'barcode' ? 'GS1 / Barcode Data' : 'Content'}</label>
              {state.textValue && (
                <button onClick={handleCopyText} className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-primary-600 transition-colors">
                  {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}<span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea rows={5} placeholder={state.type === 'barcode' ? "(01)123..." : "Enter text..."} className={`${inputClass} font-mono`} value={state.textValue} onChange={(e) => onChange({ textValue: e.target.value })} />
          </motion.div>
        )}

        {state.type === 'vcard' && (
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>First Name</label><input className={inputClass} value={getVCard().firstName} onChange={e => onChange({vcard: {...getVCard(), firstName: e.target.value}})} /></div>
                <div><label className={labelClass}>Last Name</label><input className={inputClass} value={getVCard().lastName} onChange={e => onChange({vcard: {...getVCard(), lastName: e.target.value}})} /></div>
              </div>
              <div><label className={labelClass}>Organization</label><input className={inputClass} value={getVCard().org} onChange={e => onChange({vcard: {...getVCard(), org: e.target.value}})} /></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={getVCard().email} onChange={e => onChange({vcard: {...getVCard(), email: e.target.value}})} /></div>
                 <div><label className={labelClass}>Phone</label><input type="tel" className={inputClass} value={getVCard().phone} onChange={e => onChange({vcard: {...getVCard(), phone: e.target.value}})} /></div>
              </div>
              <div><label className={labelClass}>Website</label><input type="url" className={inputClass} value={getVCard().url} onChange={e => onChange({vcard: {...getVCard(), url: e.target.value}})} /></div>
           </motion.div>
        )}

        {state.type === 'event' && (
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
              <div><label className={labelClass}>Event Title</label><input className={inputClass} value={getEvent().title} onChange={e => onChange({event: {...getEvent(), title: e.target.value}})} /></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className={labelClass}>Start</label><input type="datetime-local" className={inputClass} value={getEvent().startDate} onChange={e => onChange({event: {...getEvent(), startDate: e.target.value}})} /></div>
                 <div><label className={labelClass}>End</label><input type="datetime-local" className={inputClass} value={getEvent().endDate} onChange={e => onChange({event: {...getEvent(), endDate: e.target.value}})} /></div>
              </div>
              <div><label className={labelClass}>Location</label><input className={inputClass} value={getEvent().location} onChange={e => onChange({event: {...getEvent(), location: e.target.value}})} /></div>
              <div><label className={labelClass}>Description</label><textarea rows={2} className={inputClass} value={getEvent().description} onChange={e => onChange({event: {...getEvent(), description: e.target.value}})} /></div>
           </motion.div>
        )}

        {state.type === 'wifi' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
            <div><label className={labelClass}>SSID</label><input type="text" className={inputClass} value={state.wifi.ssid} onChange={(e) => onChange({ wifi: { ...state.wifi, ssid: e.target.value } })} /></div>
            <div><label className={labelClass}>Password</label><input type="text" className={inputClass} value={state.wifi.password} onChange={(e) => onChange({ wifi: { ...state.wifi, password: e.target.value } })} /></div>
            <div className="grid grid-cols-2 gap-4">
               <div><label className={labelClass}>Encryption</label><select className={inputClass} value={state.wifi.encryption} onChange={(e) => onChange({ wifi: { ...state.wifi, encryption: e.target.value as any } })}><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select></div>
               <div className="flex items-center pt-6"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="w-5 h-5 rounded text-primary-600" checked={state.wifi.hidden} onChange={(e) => onChange({ wifi: { ...state.wifi, hidden: e.target.checked } })} /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hidden Network</span></label></div>
            </div>
          </motion.div>
        )}

        {state.type === 'crypto' && (
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1"><label className={labelClass}>Coin</label><select className={inputClass} value={getCrypto().coin} onChange={(e) => onChange({ crypto: { ...getCrypto(), coin: e.target.value as any } })}><option value="BTC">BTC</option><option value="ETH">ETH</option></select></div>
                 <div className="col-span-2"><label className={labelClass}>Amount</label><input type="number" step="0.0001" className={inputClass} value={getCrypto().amount} onChange={(e) => onChange({ crypto: { ...getCrypto(), amount: e.target.value } })} /></div>
              </div>
              <div><label className={labelClass}>Wallet Address</label><input type="text" className={`${inputClass} font-mono`} value={getCrypto().address} onChange={(e) => onChange({ crypto: { ...getCrypto(), address: e.target.value } })} /></div>
           </motion.div>
        )}

        {state.type === 'sms' && (
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
             <div><label className={labelClass}>Phone Number</label><input type="tel" className={inputClass} value={getSMS().phone} onChange={(e) => onChange({ sms: { ...getSMS(), phone: e.target.value } })} /></div>
             <div><label className={labelClass}>Message</label><textarea rows={3} className={inputClass} value={getSMS().message} onChange={(e) => onChange({ sms: { ...getSMS(), message: e.target.value } })} /></div>
          </motion.div>
        )}

        {state.type === 'email' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig}>
             <label className={labelClass}>Email Address</label><input type="email" className={inputClass} value={state.emailValue} onChange={(e) => onChange({ emailValue: e.target.value })} />
          </motion.div>
        )}

        {state.type === 'phone' && (
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig}>
             <label className={labelClass}>Phone Number</label><input type="tel" className={inputClass} value={state.phoneValue} onChange={(e) => onChange({ phoneValue: e.target.value })} />
          </motion.div>
        )}
        
        {state.type === 'coupon' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
                <div><label className={labelClass}>Coupon Code</label><input className={`${inputClass} font-mono uppercase`} value={getCoupon().code} onChange={e => onChange({coupon: {...getCoupon(), code: e.target.value}})} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Discount</label><input className={inputClass} value={getCoupon().discount} onChange={e => onChange({coupon: {...getCoupon(), discount: e.target.value}})} /></div>
                    <div><label className={labelClass}>Item</label><input className={inputClass} value={getCoupon().item} onChange={e => onChange({coupon: {...getCoupon(), item: e.target.value}})} /></div>
                </div>
            </motion.div>
        )}

        {state.type === 'feedback' && (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="space-y-4">
                <div><label className={labelClass}>Send Feedback To</label><input type="email" className={inputClass} value={getFeedback().email} onChange={e => onChange({feedback: {...getFeedback(), email: e.target.value}})} /></div>
                <div><label className={labelClass}>Subject Line</label><input className={inputClass} value={getFeedback().subject} onChange={e => onChange({feedback: {...getFeedback(), subject: e.target.value}})} /></div>
                <div><label className={labelClass}>Default Body</label><textarea rows={3} className={inputClass} value={getFeedback().body} onChange={e => onChange({feedback: {...getFeedback(), body: e.target.value}})} /></div>
             </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
};

export default InputPanel;