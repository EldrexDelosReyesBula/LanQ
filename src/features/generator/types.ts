import type {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  GradientType,
} from "qr-code-styling";

export type ColorFill =
  | { mode: "solid"; color: string }
  | {
      mode: "gradient";
      gradientType: GradientType; // "linear" | "radial"
      rotation: number; // radians
      stops: { offset: number; color: string }[];
    };

export type FramePreset =
  | "none"
  | "minimal"
  | "soft"
  | "glass"
  | "gradient"
  | "poster"
  | "scan-cta";

export interface FrameConfig {
  preset: FramePreset;
  color: string;
  accent: string;
  radius: number;     // px
  padding: number;    // px around QR
  borderWidth: number;
  label: string;      // e.g. "SCAN ME"
}

export type TextPosition = "top" | "bottom" | "none";

export interface TextConfig {
  value: string;
  position: TextPosition;
  font: "Sora" | "Inter" | "Manrope" | "JetBrains Mono";
  weight: 400 | 500 | 600 | 700 | 800;
  size: number;
  color: string;
  letterSpacing: number; // px
}

export interface EffectsConfig {
  glow: number;      // 0..30
  shadow: number;    // 0..40
  noise: number;     // 0..0.3 opacity
}

export interface StegoConfig {
  enabled: boolean;
  author: string;
  message: string;     // hidden text
  campaign: string;    // tracking id
}

export interface QRConfig {
  data: string;
  size: number;
  margin: number;
  ecLevel: ErrorCorrectionLevel;
  backgroundColor: string;
  dotsType: DotType;
  dotsFill: ColorFill;
  cornersSquareType: CornerSquareType;
  cornersSquareColor: string;
  cornersDotType: CornerDotType;
  cornersDotColor: string;
  logo?: string;
  logoSize: number;
  logoMargin: number;
  hideDotsBehindLogo: boolean;
  frame: FrameConfig;
  text: TextConfig;
  effects: EffectsConfig;
  stego: StegoConfig;
}

export const defaultConfig: QRConfig = {
  data: typeof window !== "undefined" ? window.location.origin : "https://lanq.studio",
  size: 480,
  margin: 16,
  ecLevel: "H",
  backgroundColor: "#ffffff",
  dotsType: "rounded",
  dotsFill: {
    mode: "gradient",
    gradientType: "linear",
    rotation: Math.PI / 4,
    stops: [
      { offset: 0, color: "#7c3aed" },
      { offset: 0.5, color: "#ec4899" },
      { offset: 1, color: "#f59e0b" },
    ],
  },
  cornersSquareType: "extra-rounded",
  cornersSquareColor: "#7c3aed",
  cornersDotType: "dot",
  cornersDotColor: "#f59e0b",
  logo: undefined,
  logoSize: 0.25,
  logoMargin: 6,
  hideDotsBehindLogo: true,
  frame: {
    preset: "none",
    color: "#ffffff",
    accent: "#7c3aed",
    radius: 32,
    padding: 28,
    borderWidth: 2,
    label: "SCAN ME",
  },
  text: {
    value: "",
    position: "none",
    font: "Sora",
    weight: 700,
    size: 22,
    color: "#0f172a",
    letterSpacing: 1,
  },
  effects: {
    glow: 0,
    shadow: 0,
    noise: 0,
  },
  stego: {
    enabled: false,
    author: "",
    message: "",
    campaign: "",
  },
};
