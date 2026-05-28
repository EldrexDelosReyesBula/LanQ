import chroma from "chroma-js";
import type { QRConfig } from "@/features/generator/types";

/** Curated harmony seeds — handpicked to always read well as QR. */
const HARMONIES = [
  ["#0ea5e9", "#6366f1", "#a855f7"],
  ["#7c3aed", "#ec4899", "#f59e0b"],
  ["#059669", "#10b981", "#84cc16"],
  ["#dc2626", "#f97316", "#facc15"],
  ["#0f172a", "#1e3a8a", "#3b82f6"],
  ["#831843", "#be185d", "#fb7185"],
  ["#1f2937", "#4d7c5b", "#a3b18a"],
  ["#312e81", "#7c3aed", "#22d3ee"],
] as const;

/** Pick three harmonious colors dynamically using robust color family calculations. */
export function generateHarmony(seed?: string[]): [string, string, string] {
  if (seed && seed.length >= 3) {
    const s = chroma.scale([seed[0], seed[1], seed[2]]).mode("oklch").colors(3);
    return [s[0], s[1], s[2]];
  }

  // Generate completely dynamic color harmony using color wheel!
  const baseHue = Math.random() * 360;
  const gap = 35 + Math.random() * 45; // 35 to 80 degrees gap
  
  // Choose harmony layout styles: Analogous, Triadic, or Split
  const layout = Math.random();
  let h1 = baseHue;
  let h2 = (baseHue + gap) % 360;
  let h3 = (baseHue + gap * 2) % 360;

  if (layout < 0.35) {
    // Triadic style
    h2 = (baseHue + 120) % 360;
    h3 = (baseHue + 240) % 360;
  } else if (layout < 0.7) {
    // Split complementary
    h2 = (baseHue + 150) % 360;
    h3 = (baseHue + 210) % 360;
  }

  // Distinct saturation & lightness curves for vibrant contrast
  const s1 = 0.7 + Math.random() * 0.25;
  const s2 = 0.65 + Math.random() * 0.25;
  const s3 = 0.6 + Math.random() * 0.3;

  const l1 = 0.35 + Math.random() * 0.15;
  const l2 = 0.3 + Math.random() * 0.15;
  const l3 = 0.25 + Math.random() * 0.15;

  const c1 = chroma.hsl(h1, s1, l1).hex();
  const c2 = chroma.hsl(h2, s2, l2).hex();
  const c3 = chroma.hsl(h3, s3, l3).hex();

  return [c1, c2, c3];
}

/** Pick a soft, complementary background for a given foreground palette. */
export function suggestBackground(colors: string[]): string {
  const avg = chroma.average(colors, "oklch");
  // tint toward near-white using opposite luminance
  const bg = chroma.mix("white", avg, 0.06, "oklch").hex();
  return bg;
}

/** Ensure dots vs background contrast >= 4.5; darken stops if needed. */
export function enforceReadability(
  stops: { offset: number; color: string }[],
  background: string,
): { offset: number; color: string }[] {
  const bg = chroma(background);
  return stops.map((s) => {
    let c = chroma(s.color);
    let tries = 0;
    while (chroma.contrast(c, bg) < 4.5 && tries < 10) {
      c = bg.luminance() > 0.5 ? c.darken(0.4) : c.brighten(0.4);
      tries++;
    }
    return { offset: s.offset, color: c.hex() };
  });
}

/** Full auto-blend: build a new QRConfig from a seed palette. */
export function autoBlend(current: QRConfig, seed?: string[]): QRConfig {
  const harmony = generateHarmony(seed);
  const background = seed
    ? suggestBackground(seed)
    : suggestBackground(harmony);

  if (current.dotsFill.mode === "solid") {
    const bg = chroma(background);
    let primaryColor = chroma(harmony[0]);
    let tries = 0;
    while (chroma.contrast(primaryColor, bg) < 4.5 && tries < 10) {
      primaryColor = bg.luminance() > 0.5 ? primaryColor.darken(0.4) : primaryColor.brighten(0.4);
      tries++;
    }
    const safeColor = primaryColor.hex();

    let secondaryColor = chroma(harmony[2] || harmony[0]);
    tries = 0;
    while (chroma.contrast(secondaryColor, bg) < 4.5 && tries < 10) {
      secondaryColor = bg.luminance() > 0.5 ? secondaryColor.darken(0.4) : secondaryColor.brighten(0.4);
      tries++;
    }
    const safeSecondary = secondaryColor.hex();

    return {
      ...current,
      backgroundColor: background,
      dotsFill: {
        mode: "solid",
        color: safeColor,
      },
      cornersSquareColor: safeColor,
      cornersDotColor: safeSecondary,
    };
  }

  const stops = enforceReadability(
    [
      { offset: 0, color: harmony[0] },
      { offset: 0.5, color: harmony[1] },
      { offset: 1, color: harmony[2] },
    ],
    background,
  );
  return {
    ...current,
    backgroundColor: background,
    dotsFill: {
      mode: "gradient",
      gradientType: Math.random() > 0.5 ? "linear" : "radial",
      rotation: Math.random() * Math.PI * 2,
      stops,
    },
    cornersSquareColor: stops[0].color,
    cornersDotColor: stops[stops.length - 1].color,
  };
}

/** 3-point gradient → conic blend approximation (use as linear with 4 stops). */
export function threePointGradient(
  a: string,
  b: string,
  c: string,
  rotationDeg = 45,
): QRConfig["dotsFill"] {
  return {
    mode: "gradient",
    gradientType: "linear",
    rotation: (rotationDeg * Math.PI) / 180,
    stops: [
      { offset: 0, color: a },
      { offset: 0.5, color: b },
      { offset: 1, color: c },
    ],
  };
}
