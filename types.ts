export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRContentCheck = 
  | 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'vcard' 
  | 'sms' | 'crypto' | 'social' | 'event' | 'coupon' | 'feedback' | 'barcode' 
  | 'pdf' | 'mp3' | 'images' | 'video' | 'app' | 'business';

export type QRShape = 'square' | 'circle' | 'rounded' | 'squircle' | 'diamond' | 'plus' | 'triangle' | 'pentagon';

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
  title: string;
  url: string;
}

export interface SMSConfig {
  phone: string;
  message: string;
}

export interface CryptoConfig {
  coin: 'BTC' | 'ETH';
  address: string;
  amount: string;
}

export interface SocialConfig {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'custom';
  username: string;
}

export interface EventConfig {
  title: string;
  location: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  description: string;
}

export interface CouponConfig {
  code: string;
  discount: string;
  item: string;
}

export interface FeedbackConfig {
  email: string;
  subject: string;
  body: string;
}

export interface QRState {
  type: QRContentCheck;
  value: string; // The final string to encode
  
  // Persistent storage for specific inputs
  urlValue: string;
  textValue: string;
  emailValue: string;
  phoneValue: string;
  
  wifi: WifiConfig;
  vcard: VCardConfig;
  sms: SMSConfig;
  crypto: CryptoConfig;
  social: SocialConfig;
  event: EventConfig;
  coupon: CouponConfig;
  feedback: FeedbackConfig;
}

export interface DesignState {
  fgColor: string;
  bgColor: string;
  shape: QRShape;
  logo: string | null; // Data URL
  logoSize: number; // 0.1 to 0.3
  margin: number; // Quiet zone in modules
  errorCorrection: QRCodeErrorCorrectionLevel;
  footerText: string;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  uiStyle: 'glass';
}

// Helper types for the engine
export interface QRModule {
  x: number;
  y: number;
  isDark: boolean;
  isFinder: boolean;
}