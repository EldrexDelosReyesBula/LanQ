import React, { useEffect, useRef, useState, useCallback } from 'react';
import { animate, useMotionValue, AnimatePresence, motion } from 'framer-motion';
import { DesignState, QRState } from '../types';
import { generateQRData, isFinderPattern } from '../utils/qrEngine';
import { Download, Share2, CheckCircle2, FileIcon, X } from './IconComponents';
import { triggerHaptic } from '../utils/haptics';

interface PreviewPanelProps {
  content: QRState;
  design: DesignState;
  onDownload?: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ content, design, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [qrData, setQrData] = useState<{ modules: boolean[][], size: number } | null>(null);
  
  // Physics based motion values for color fluid transitions
  const fgColorM = useMotionValue(design.fgColor);
  const bgColorM = useMotionValue(design.bgColor);
  
  const SCALE_FACTOR = 4;
  const DISPLAY_SIZE = 300;
  const FOOTER_HEIGHT = 40;

  const hasContent = !!content.value;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) setCanShare(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    const generate = async () => {
      if (!content.value) {
          if (mounted) setQrData(null);
          return;
      }
      try {
        const data = await generateQRData(content.value, design.errorCorrection);
        if (mounted) setQrData(data);
      } catch (e) { console.error("QR Gen Error", e); }
    };
    generate();
    return () => { mounted = false; };
  }, [content.value, design.errorCorrection]);

  const renderCanvas = useCallback(async (fg: string, bg: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasContent || !qrData) {
        // Render placeholder
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = DISPLAY_SIZE * 2;
            canvas.height = DISPLAY_SIZE * 2;
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = fg;
            ctx.globalAlpha = 0.1;
            // Draw a simple grid or placeholder icon
            const s = 40;
            for(let i=0; i<canvas.width; i+=s) {
                for(let j=0; j<canvas.height; j+=s) {
                   if((i+j)%(s*2) === 0) ctx.fillRect(i,j,s,s); 
                }
            }
            ctx.globalAlpha = 1;
        }
        return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const { modules, size } = qrData;
    const marginModules = design.margin || 0;
    const totalModules = size + (marginModules * 2);
    const basePixelSize = DISPLAY_SIZE * SCALE_FACTOR;
    const extraFooterHeight = design.footerText ? (FOOTER_HEIGHT * SCALE_FACTOR) : 0;
    const totalWidth = basePixelSize;
    const totalHeight = basePixelSize + extraFooterHeight;
    if (canvas.width !== totalWidth || canvas.height !== totalHeight) { canvas.width = totalWidth; canvas.height = totalHeight; }
    const moduleSize = basePixelSize / totalModules;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    ctx.fillStyle = fg;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (modules[y][x]) {
            const px = (x + marginModules) * moduleSize;
            const py = (y + marginModules) * moduleSize;
            const s = moduleSize;
            if (isFinderPattern(x, y, size)) { ctx.fillRect(px, py, s, s); continue; }
            
            switch (design.shape) {
                case 'circle': 
                    ctx.beginPath(); 
                    ctx.arc(px + s / 2, py + s / 2, s / 2, 0, Math.PI * 2); 
                    ctx.fill(); 
                    break;
                case 'rounded': 
                    ctx.beginPath(); 
                    ctx.roundRect(px, py, s, s, s * 0.25); 
                    ctx.fill(); 
                    break;
                case 'squircle': 
                    ctx.beginPath(); 
                    ctx.moveTo(px + s/2, py); 
                    ctx.bezierCurveTo(px + s, py, px + s, py + s, px + s/2, py + s); 
                    ctx.bezierCurveTo(px, py + s, px, py, px + s/2, py); 
                    ctx.fill(); 
                    break;
                case 'diamond': 
                    ctx.beginPath(); 
                    ctx.moveTo(px + s/2, py); 
                    ctx.lineTo(px + s, py + s/2); 
                    ctx.lineTo(px + s/2, py + s); 
                    ctx.lineTo(px, py + s/2); 
                    ctx.closePath(); 
                    ctx.fill(); 
                    break;
                case 'plus': 
                    const t = s * 0.35; 
                    const offset = (s - t) / 2; 
                    ctx.fillRect(px + offset, py, t, s); 
                    ctx.fillRect(px, py + offset, s, t); 
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(px + s / 2, py);
                    ctx.lineTo(px + s, py + s);
                    ctx.lineTo(px, py + s);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'pentagon':
                    ctx.beginPath();
                    ctx.moveTo(px + s / 2, py);
                    ctx.lineTo(px + s, py + s * 0.38);
                    ctx.lineTo(px + s * 0.82, py + s);
                    ctx.lineTo(px + s * 0.18, py + s);
                    ctx.lineTo(px, py + s * 0.38);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'square': 
                default: 
                    ctx.fillRect(px, py, s, s);
            }
        }
      }
    }
    if (design.logo) {
        const logoImg = new Image(); logoImg.src = design.logo;
        await new Promise((resolve) => { logoImg.onload = resolve; });
        const logoPixels = size * moduleSize * design.logoSize;
        const logoX = (basePixelSize - logoPixels) / 2;
        const logoY = (basePixelSize - logoPixels) / 2;
        ctx.fillStyle = bg; const pad = moduleSize;
        ctx.beginPath(); ctx.roundRect(logoX - pad/2, logoY - pad/2, logoPixels + pad, logoPixels + pad, moduleSize * 2); ctx.fill();
        ctx.drawImage(logoImg, logoX, logoY, logoPixels, logoPixels);
    }
    if (design.footerText) {
       ctx.fillStyle = fg; ctx.font = `bold ${20 * SCALE_FACTOR}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
       ctx.fillText(design.footerText.toUpperCase(), totalWidth / 2, basePixelSize + (extraFooterHeight / 2));
    }
  }, [qrData, design.shape, design.margin, design.logo, design.logoSize, design.footerText, SCALE_FACTOR, hasContent]);

  useEffect(() => {
    // Use physics spring for smooth color transition "painting" effect
    const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };
    
    // Subscribe to changes instead of using onUpdate in animate options
    const unsubFg = fgColorM.on('change', (latest) => renderCanvas(latest, bgColorM.get()));
    const unsubBg = bgColorM.on('change', (latest) => renderCanvas(fgColorM.get(), latest));

    const controlsFg = animate(fgColorM, design.fgColor, springTransition);
    const controlsBg = animate(bgColorM, design.bgColor, springTransition);
    
    return () => { 
      controlsFg.stop(); 
      controlsBg.stop();
      unsubFg();
      unsubBg();
    };
  }, [design.fgColor, design.bgColor, fgColorM, bgColorM, renderCanvas]);

  useEffect(() => { renderCanvas(fgColorM.get(), bgColorM.get()); }, [qrData, design.shape, design.margin, design.logo, design.logoSize, design.footerText, renderCanvas, fgColorM, bgColorM, hasContent]);

  const downloadPNG = () => {
    if (!hasContent) return;
    const canvas = canvasRef.current; if (!canvas) return;
    setDownloading(true); triggerHaptic('medium');
    setTimeout(() => {
      const link = document.createElement('a'); link.download = `lanq-qr-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
      setDownloading(false); setDownloadSuccess(true); triggerHaptic('success'); if (onDownload) onDownload();
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 800);
  };

  const getSVGData = () => {
      if (!qrData) return null;
      const { modules, size } = qrData;
      const marginModules = design.margin || 0;
      const totalModules = size + (marginModules * 2);
      const footerUnits = design.footerText ? 4 : 0;
      const viewBoxHeight = totalModules + footerUnits;
      let svgContent = `<rect width="100%" height="100%" fill="${design.bgColor}"/>`;
      
      let path = "";
      modules.forEach((row, y) => row.forEach((isDark, x) => {
          if (isDark) {
            const px = x + marginModules; const py = y + marginModules;
            if (design.shape === 'triangle') {
               path += `M${px+0.5},${py} L${px+1},${py+1} L${px},${py+1} Z `;
            } else if (design.shape === 'pentagon') {
               path += `M${px+0.5},${py} L${px+1},${py+0.38} L${px+0.82},${py+1} L${px+0.18},${py+1} L${px},${py+0.38} Z `;
            } else {
               path += `M${px},${py}h1v1h-1z `;
            }
          }
      }));
      
      svgContent += `<path d="${path}" fill="${design.fgColor}"/>`;
      
      if (design.footerText) {
        svgContent += `<text x="50%" y="${totalModules + 2}" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="2" fill="${design.fgColor}">${design.footerText.toUpperCase()}</text>`;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalModules} ${viewBoxHeight}">${svgContent}</svg>`;
  }

  const handleShare = async (format: 'png' | 'svg') => {
    if (!hasContent) return;
    setShowShareOptions(false);
    
    try {
      triggerHaptic('medium');
      let file: File | null = null;
      
      if (format === 'png') {
          const canvas = canvasRef.current; if (!canvas) return;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png')); if (!blob) return;
          file = new File([blob], 'lanq-qr.png', { type: 'image/png' });
      } else {
          const svgData = getSVGData();
          if (!svgData) return;
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          file = new File([blob], 'lanq-qr.svg', { type: 'image/svg+xml' });
      }
      
      if (navigator.share && file) {
          const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lanq.landecs.org';
          await navigator.share({ 
            title: 'Check out my QR Code made with LanQ', 
            text: `I created this awesome QR code using LanQ - a free, offline-first QR generator. Try it yourself: ${appUrl}`,
            files: [file] 
          });
          triggerHaptic('success');
      }
    } catch (err) { console.error(err); }
  };

  const downloadSVG = async () => {
    if (!hasContent) return;
    const svgData = getSVGData();
    if (!svgData) return;
    triggerHaptic('medium');
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `lanq-qr-${Date.now()}.svg`; link.click(); URL.revokeObjectURL(url);
    if (onDownload) onDownload();
    triggerHaptic('success');
  };

  return (
    <div className="sticky top-24 space-y-6 animate-fade-in pb-20 lg:pb-0">
      <div ref={containerRef} className={`ui-panel relative group p-8 flex flex-col items-center justify-center transition-transform duration-500 ${hasContent ? 'hover:scale-[1.02]' : 'opacity-80 grayscale-[0.5]'}`}>
        <div className="relative overflow-hidden rounded-xl shadow-inner bg-white"><canvas ref={canvasRef} style={{ width: `${DISPLAY_SIZE}px`, height: 'auto', maxWidth: '100%' }} /></div>
        <p className="mt-6 text-sm font-medium text-gray-400 dark:text-neutral-500 font-mono">
            {hasContent && qrData ? `${qrData.size}x${qrData.size} Modules` : 'Start typing to generate...'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {!downloadSuccess ? (
              <motion.button key="download-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onClick={downloadPNG} disabled={!hasContent || downloading} className="relative flex items-center justify-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-gray-900/20 dark:shadow-white/20 overflow-hidden ui-button disabled:opacity-50 disabled:pointer-events-none">
                {downloading ? <span className="animate-pulse">Exporting...</span> : <><Download size={18} /><span>PNG</span></>}
              </motion.button>
            ) : (
               <motion.button key="success-btn" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 pointer-events-none ui-button"><CheckCircle2 size={18} /><span>Saved!</span></motion.button>
            )}
          </AnimatePresence>
          <button onClick={downloadSVG} disabled={!hasContent} className="flex items-center justify-center space-x-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-neutral-700 active:scale-95 transition-all ui-button disabled:opacity-50 disabled:pointer-events-none"><FileIcon size={18} /><span>SVG</span></button>
        </div>
        
        {canShare && (
           <div className="relative">
             {!showShareOptions ? (
               <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={() => setShowShareOptions(true)} disabled={!hasContent} className="w-full flex items-center justify-center space-x-2 bg-primary-100/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/30 py-3.5 rounded-xl font-bold text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 active:scale-95 transition-all ui-button disabled:opacity-50 disabled:pointer-events-none"><Share2 size={18} /><span>Share Image</span></motion.button>
             ) : (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                    <button onClick={() => handleShare('png')} className="flex-1 bg-primary-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 ui-button">PNG</button>
                    <button onClick={() => handleShare('svg')} className="flex-1 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all ui-button">SVG</button>
                    <button onClick={() => setShowShareOptions(false)} className="px-4 bg-gray-100 dark:bg-neutral-800 text-gray-500 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all"><X size={18}/></button>
                </motion.div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
