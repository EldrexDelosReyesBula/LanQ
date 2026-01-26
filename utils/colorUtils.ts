/**
 * Calculates luminance of a hex color (WCAG 2.0)
 */
const getLuminance = (hex: string): number => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const [lr, lg, lb] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

/**
 * Calculates contrast ratio between two hex colors (1 to 21)
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (bright + 0.05) / (dark + 0.05);
};

// Helper to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Generates an accessible, aesthetically pleasing color pair
 * Ensures strict WCAG AA (4.5:1) compliance
 */
export const generateAutoBlend = (): { fg: string, bg: string } => {
  let fg, bg, ratio;
  let attempts = 0;
  
  do {
    const hue = Math.floor(Math.random() * 360);
    const isDarkBg = Math.random() > 0.5;

    if (isDarkBg) {
      // Dark saturated background
      bg = hslToHex(hue, 30 + Math.random() * 50, 5 + Math.random() * 15);
      // Light pastel foreground (complementary or split comp)
      const fgHue = (hue + 180 + (Math.random() * 60 - 30)) % 360;
      fg = hslToHex(fgHue, 50 + Math.random() * 50, 85 + Math.random() * 15);
    } else {
      // Light tint background
      bg = hslToHex(hue, 10 + Math.random() * 40, 90 + Math.random() * 10);
      // Dark foreground
      const fgHue = (hue + 180 + (Math.random() * 60 - 30)) % 360;
      fg = hslToHex(fgHue, 60 + Math.random() * 40, 10 + Math.random() * 20);
    }

    ratio = getContrastRatio(fg, bg);
    attempts++;
  } while (ratio < 4.5 && attempts < 10);

  // Fallback to high contrast if random generation fails repeatedly
  if (ratio < 4.5) {
     return Math.random() > 0.5 
       ? { fg: '#FFFFFF', bg: '#000000' } 
       : { fg: '#0F172A', bg: '#F8FAFC' };
  }
  
  return { fg, bg };
};