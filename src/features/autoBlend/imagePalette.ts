// Local-only image palette extraction using node-vibrant (browser build).
import { Vibrant } from "node-vibrant/browser";
import chroma from "chroma-js";

export interface ExtractedPalette {
  dominant: string;
  accent: string;
  muted: string;
  vibrant: string;
  all: string[];
  mood: "warm" | "cool" | "neutral";
  brightness: "light" | "dark";
}

export async function extractPalette(file: File): Promise<ExtractedPalette> {
  const url = URL.createObjectURL(file);
  try {
    const p = await Vibrant.from(url).getPalette();
    const dominant = p.Vibrant?.hex ?? p.DarkVibrant?.hex ?? "#7c3aed";
    const accent = p.LightVibrant?.hex ?? p.Muted?.hex ?? "#ec4899";
    const muted = p.Muted?.hex ?? p.DarkMuted?.hex ?? "#94a3b8";
    const vibrant = p.Vibrant?.hex ?? p.LightVibrant?.hex ?? dominant;
    const all = [
      p.DarkVibrant?.hex,
      p.Vibrant?.hex,
      p.LightVibrant?.hex,
      p.Muted?.hex,
      p.DarkMuted?.hex,
      p.LightMuted?.hex,
    ].filter(Boolean) as string[];

    const avg = chroma.average(all.length ? all : [dominant], "oklch");
    const [, , h] = avg.oklch();
    const hue = isNaN(h) ? 0 : h;
    const mood: ExtractedPalette["mood"] =
      hue > 20 && hue < 140 ? "warm" : hue > 200 && hue < 320 ? "cool" : "neutral";
    const brightness: ExtractedPalette["brightness"] =
      avg.luminance() > 0.5 ? "light" : "dark";

    return { dominant, accent, muted, vibrant, all, mood, brightness };
  } finally {
    URL.revokeObjectURL(url);
  }
}
