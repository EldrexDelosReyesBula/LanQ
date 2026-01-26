import { WifiConfig, VCardConfig, SMSConfig, CryptoConfig, SocialConfig, EventConfig, CouponConfig, FeedbackConfig, DesignState } from './types';

export const DEFAULT_WIFI: WifiConfig = {
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false,
};

export const DEFAULT_VCARD: VCardConfig = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  org: '',
  title: '',
  url: '',
};

export const DEFAULT_SMS: SMSConfig = {
  phone: '',
  message: '',
};

export const DEFAULT_CRYPTO: CryptoConfig = {
  coin: 'BTC',
  address: '',
  amount: '',
};

export const DEFAULT_SOCIAL: SocialConfig = {
  platform: 'twitter',
  username: '',
};

export const DEFAULT_EVENT: EventConfig = {
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
};

export const DEFAULT_COUPON: CouponConfig = {
  code: 'SAVE20',
  discount: '20%',
  item: 'All Items',
};

export const DEFAULT_FEEDBACK: FeedbackConfig = {
  email: '',
  subject: 'Feedback regarding...',
  body: 'I would like to rate my experience as...',
};

export const PRESETS = {
  fgColor: '#000000',
  bgColor: '#FFFFFF',
};

export const SAFE_ZONE_MARGIN = 4; // modules
export const MIN_CONTRAST_RATIO = 3.0;

// Optimized Color Palettes for High Contrast & Premium Glass Look
export const COLOR_PALETTES = [
  { name: 'Classic', fg: '#000000', bg: '#FFFFFF' }, 
  { name: 'Midnight', fg: '#F8FAFC', bg: '#0F172A' },
  { name: 'Electric', fg: '#FFFFFF', bg: '#2563EB' }, 
  { name: 'Luxury', fg: '#78350F', bg: '#FFFBEB' }, 
  { name: 'Emerald', fg: '#064E3B', bg: '#ECFDF5' }, 
  { name: 'Royal', fg: '#FFFFFF', bg: '#4C1D95' }, 
  { name: 'Rose', fg: '#881337', bg: '#FFF1F2' }, 
  { name: 'Charcoal', fg: '#E5E5E5', bg: '#171717' },
  { name: 'Ocean', fg: '#0C4A6E', bg: '#F0F9FF' },
  { name: 'Cyber', fg: '#000000', bg: '#00FF9D' }, 
  { name: 'Sunset', fg: '#7C2D12', bg: '#FFEDD5' }, 
  { name: 'Lavender', fg: '#4C1D95', bg: '#F3E8FF' }, 
];

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  design: Partial<DesignState>;
}

export const READY_MADE_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'minimal-sq',
    name: 'Minimalist',
    category: 'Essential',
    design: {
      shape: 'square',
      fgColor: '#171717',
      bgColor: '#FFFFFF',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'industrial-alert',
    name: 'Hazard',
    category: 'Bold',
    design: {
      shape: 'square',
      fgColor: '#000000',
      bgColor: '#FACC15',
      margin: 4,
      logoSize: 0.15,
      footerText: 'SCAN HAZARD'
    }
  },
  {
    id: 'soft-rnd',
    name: 'Soft Tech',
    category: 'Modern',
    design: {
      shape: 'rounded',
      fgColor: '#334155',
      bgColor: '#F8FAFC',
      margin: 5,
      logoSize: 0.18,
      footerText: ''
    }
  },
  {
    id: 'eco-leaf',
    name: 'Eco Friendly',
    category: 'Nature',
    design: {
      shape: 'squircle',
      fgColor: '#14532D',
      bgColor: '#F0FDF4',
      margin: 4,
      logoSize: 0.2,
      footerText: 'Recycle'
    }
  },
  {
    id: 'brand-dot',
    name: 'Modern Dot',
    category: 'Modern',
    design: {
      shape: 'circle',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      margin: 6,
      logoSize: 0.2,
      footerText: ''
    }
  },
  {
    id: 'night-mode',
    name: 'Night Owl',
    category: 'Dark',
    design: {
      shape: 'rounded',
      fgColor: '#E2E8F0',
      bgColor: '#0F172A',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'social-pop',
    name: 'Social Pop',
    category: 'Fun',
    design: {
      shape: 'squircle',
      fgColor: '#FFFFFF',
      bgColor: '#BE185D',
      margin: 4,
      logoSize: 0.2,
      footerText: 'Follow Us'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'Nature',
    design: {
      shape: 'rounded',
      fgColor: '#0C4A6E',
      bgColor: '#E0F2FE',
      margin: 4,
      logoSize: 0.18,
      footerText: ''
    }
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk',
    category: 'Bold',
    design: {
      shape: 'square',
      fgColor: '#00FF9D',
      bgColor: '#111111',
      margin: 2,
      logoSize: 0.15,
      footerText: 'SCAN ME'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury',
    category: 'Premium',
    design: {
      shape: 'squircle',
      fgColor: '#78350F',
      bgColor: '#FEF3C7',
      margin: 5,
      logoSize: 0.2,
      footerText: ''
    }
  },
  {
    id: 'royal-purple',
    name: 'Royalty',
    category: 'Premium',
    design: {
      shape: 'rounded',
      fgColor: '#FFFFFF',
      bgColor: '#581C87',
      margin: 4,
      logoSize: 0.15,
      footerText: 'VIP'
    }
  },
  {
    id: 'vintage-paper',
    name: 'Vintage',
    category: 'Classic',
    design: {
      shape: 'square',
      fgColor: '#451A03',
      bgColor: '#F5F5F4',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'blueprint-tech',
    name: 'Blueprint',
    category: 'Modern',
    design: {
      shape: 'square',
      fgColor: '#FFFFFF',
      bgColor: '#2563EB',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'matrix-code',
    name: 'The Matrix',
    category: 'Bold',
    design: {
      shape: 'square',
      fgColor: '#22C55E',
      bgColor: '#000000',
      margin: 2,
      logoSize: 0.15,
      footerText: 'ENTER'
    }
  },
  {
    id: 'candy-pop',
    name: 'Candy',
    category: 'Fun',
    design: {
      shape: 'circle',
      fgColor: '#DB2777',
      bgColor: '#FCE7F3',
      margin: 5,
      logoSize: 0.2,
      footerText: 'YUM'
    }
  },
  {
    id: 'northern-lights',
    name: 'Aurora',
    category: 'Dark',
    design: {
      shape: 'rounded',
      fgColor: '#2DD4BF',
      bgColor: '#134E4A',
      margin: 4,
      logoSize: 0.18,
      footerText: ''
    }
  },
  {
    id: 'monochrome-matte',
    name: 'Matte Black',
    category: 'Premium',
    design: {
      shape: 'squircle',
      fgColor: '#262626',
      bgColor: '#E5E5E5',
      margin: 6,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'warm-ember',
    name: 'Ember',
    category: 'Bold',
    design: {
      shape: 'rounded',
      fgColor: '#7F1D1D',
      bgColor: '#FEF2F2',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'cool-mint',
    name: 'Minty',
    category: 'Fun',
    design: {
      shape: 'circle',
      fgColor: '#047857',
      bgColor: '#D1FAE5',
      margin: 5,
      logoSize: 0.18,
      footerText: ''
    }
  },
  {
    id: 'slate-minimal',
    name: 'Slate',
    category: 'Essential',
    design: {
      shape: 'square',
      fgColor: '#334155',
      bgColor: '#FFFFFF',
      margin: 4,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'lavender-haze',
    name: 'Lavender',
    category: 'Modern',
    design: {
      shape: 'squircle',
      fgColor: '#4C1D95',
      bgColor: '#F3E8FF',
      margin: 4,
      logoSize: 0.2,
      footerText: ''
    }
  },
  {
    id: 'high-contrast',
    name: 'B&W Bold',
    category: 'Bold',
    design: {
      shape: 'square',
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      margin: 0,
      logoSize: 0.15,
      footerText: ''
    }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate',
    category: 'Business',
    design: {
      shape: 'square',
      fgColor: '#1E3A8A',
      bgColor: '#EFF6FF',
      margin: 4,
      logoSize: 0.2,
      footerText: ''
    }
  },
  {
    id: 'sunset-orange',
    name: 'Citrus',
    category: 'Fun',
    design: {
      shape: 'rounded',
      fgColor: '#C2410C',
      bgColor: '#FFEDD5',
      margin: 4,
      logoSize: 0.18,
      footerText: ''
    }
  },
  {
    id: 'deep-forest',
    name: 'Deep Forest',
    category: 'Nature',
    design: {
      shape: 'squircle',
      fgColor: '#022C22',
      bgColor: '#D1FAE5',
      margin: 4,
      logoSize: 0.2,
      footerText: ''
    }
  }
];