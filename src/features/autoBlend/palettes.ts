import chroma from "chroma-js";

export type Palette = {
  id: string;
  name: string;
  colors: [string, string, string];
  background: string;
  fillType?: "solid" | "linear" | "radial";
};

export const PALETTES: Palette[] = [
  // Curated Linear Gradients
  { id: "bloom",    name: "Minimalist Bloom",    colors: ["#f43f5e", "#fb7185", "#fda4af"], background: "#fff7f8", fillType: "linear" },
  { id: "azure",    name: "Technical Grid",      colors: ["#0f172a", "#1e3a8a", "#3b82f6"], background: "#f5f8ff", fillType: "linear" },
  { id: "sage",     name: "Organic Canvas",      colors: ["#1f2937", "#4d7c5b", "#a3b18a"], background: "#f4f1ea", fillType: "linear" },
  { id: "dusk",     name: "Chromatic Horizon",   colors: ["#7c3aed", "#ec4899", "#f59e0b"], background: "#fff8ee", fillType: "linear" },
  { id: "void",     name: "Premium Stealth",     colors: ["#000000", "#27272a", "#52525b"], background: "#fafafa", fillType: "linear" },
  { id: "sun",      name: "Solarized Pulse",     colors: ["#f59e0b", "#fb923c", "#fbbf24"], background: "#fffaf0", fillType: "linear" },
  { id: "forest",   name: "Emerald Forest",      colors: ["#064e3b", "#059669", "#34d399"], background: "#f0fbf7", fillType: "linear" },
  { id: "grape",    name: "Neon Grape",          colors: ["#4a0e4e", "#8c1bab", "#d53df5"], background: "#faf0fc", fillType: "linear" },
  { id: "ocean",    name: "Deep Indigo Ocean",   colors: ["#1e1b4b", "#4f46e5", "#818cf8"], background: "#f4f5fc", fillType: "linear" },
  { id: "sunset",   name: "Terracotta Earth",    colors: ["#7c2d12", "#db4a0b", "#f97316"], background: "#fff6f0", fillType: "linear" },
  { id: "mint",     name: "Cyber Mint Grid",     colors: ["#0c4a6e", "#0284c7", "#0d9488"], background: "#f0fafb", fillType: "linear" },
  { id: "aurora",   name: "Boreal Glow",         colors: ["#111827", "#059669", "#10b981"], background: "#f3faf7", fillType: "linear" },
  { id: "nebula",   name: "Nebula Spark",        colors: ["#581c87", "#c084fc", "#e879f9"], background: "#faf5ff", fillType: "linear" },

  // Curated Radial Gradients
  { id: "cosmic",   name: "Cosmic Radiance",     colors: ["#e11d48", "#4f46e5", "#06b6d4"], background: "#faf9ff", fillType: "radial" },
  { id: "stellar",  name: "Stellar Flare",       colors: ["#f43f5e", "#db2777", "#f59e0b"], background: "#fff6f6", fillType: "radial" },
  { id: "hyper",    name: "Hyper Space",         colors: ["#c084fc", "#6366f1", "#06b6d4"], background: "#fbfaff", fillType: "radial" },
  { id: "oasis",    name: "Tropical Oasis",      colors: ["#0d9488", "#22c55e", "#eab308"], background: "#f4fdf9", fillType: "radial" },
  { id: "solar",    name: "Solar Flare",         colors: ["#dc2626", "#ea580c", "#facc15"], background: "#fffbf5", fillType: "radial" },
  { id: "abyss",    name: "Deep Abyss",          colors: ["#4f46e5", "#0f172a", "#000000"], background: "#fafaff", fillType: "radial" },

  // Curated Solid Colors
  { id: "solid-minimalist",  name: "Minimalist",    colors: ["#18181b", "#18181b", "#18181b"], background: "#fafafa", fillType: "solid" },
  { id: "solid-slate",       name: "Slate",         colors: ["#334155", "#334155", "#334155"], background: "#f8fafc", fillType: "solid" },
  { id: "solid-hazard",      name: "Hazard",        colors: ["#b45309", "#b45309", "#b45309"], background: "#fefce8", fillType: "solid" },
  { id: "solid-cyberpunk",   name: "Cyberpunk",     colors: ["#db2777", "#db2777", "#db2777"], background: "#fdf2ff", fillType: "solid" },
  { id: "solid-matrix",      name: "The Matrix",    colors: ["#15803d", "#15803d", "#15803d"], background: "#f0fdf4", fillType: "solid" },
  { id: "solid-ember",       name: "Ember",         colors: ["#ea580c", "#ea580c", "#ea580c"], background: "#fff7ed", fillType: "solid" },
  { id: "solid-bw",          name: "B&W Bold",      colors: ["#000000", "#000000", "#000000"], background: "#ffffff", fillType: "solid" },
  { id: "solid-softtech",    name: "Soft Tech",     colors: ["#4b5563", "#4b5563", "#4b5563"], background: "#f3f4f6", fillType: "solid" },
  { id: "solid-coder",       name: "Modern Dot",    colors: ["#262626", "#262626", "#262626"], background: "#fafafa", fillType: "solid" },
  { id: "solid-blueprint",   name: "Blueprint",     colors: ["#1d4ed8", "#1d4ed8", "#1d4ed8"], background: "#eff6ff", fillType: "solid" },
  { id: "solid-lavender",    name: "Lavender",      colors: ["#6d28d9", "#6d28d9", "#6d28d9"], background: "#f5f3ff", fillType: "solid" },
  { id: "solid-eco",         name: "Eco Friendly",  colors: ["#15803d", "#15803d", "#15803d"], background: "#f0fdf4", fillType: "solid" },
  { id: "solid-ocean",       name: "Ocean Breeze",  colors: ["#0369a1", "#0369a1", "#0369a1"], background: "#f0f9ff", fillType: "solid" },
  { id: "solid-forest",      name: "Deep Forest",   colors: ["#064e3b", "#064e3b", "#064e3b"], background: "#ecfdf5", fillType: "solid" },
  { id: "solid-owl",         name: "Night Owl",     colors: ["#e2e8f0", "#e2e8f0", "#e2e8f0"], background: "#0a0f1d", fillType: "solid" },
  { id: "solid-aurora",      name: "Aurora",        colors: ["#0d9488", "#0d9488", "#0d9488"], background: "#f0fdfa", fillType: "solid" },
  { id: "solid-candy",       name: "Candy",         colors: ["#ec4899", "#ec4899", "#ec4899"], background: "#fdf2f8", fillType: "solid" },
  { id: "solid-minty",       name: "Minty",         colors: ["#059669", "#059669", "#059669"], background: "#ecfdf5", fillType: "solid" },
  { id: "solid-citrus",      name: "Citrus",        colors: ["#4d7c0f", "#4d7c0f", "#4d7c0f"], background: "#f7fee7", fillType: "solid" },
  { id: "solid-luxury",      name: "Luxury",        colors: ["#854d0e", "#854d0e", "#854d0e"], background: "#fdfdfa", fillType: "solid" },
  { id: "solid-royalty",     name: "Royalty",       colors: ["#701a75", "#701a75", "#701a75"], background: "#fdf4ff", fillType: "solid" },
  { id: "solid-black",       name: "Matte Black",   colors: ["#171717", "#171717", "#171717"], background: "#f5f5f5", fillType: "solid" },
  { id: "solid-vintage",     name: "Vintage",       colors: ["#78350f", "#78350f", "#78350f"], background: "#fdfbeb", fillType: "solid" },
  { id: "solid-corp",        name: "Corporate",     colors: ["#1e3a8a", "#1e3a8a", "#1e3a8a"], background: "#eff6ff", fillType: "solid" },
];

/** Validate contrast of foreground gradient against background; nudge if too low. */
export function ensureReadable(p: Palette): Palette {
  const bg = chroma(p.background);
  const isDarkBg = bg.luminance() < 0.5;
  const fixed = p.colors.map((c) => {
    let col = chroma(c);
    let tries = 0;
    while (chroma.contrast(col, bg) < 4.5 && tries < 10) {
      if (isDarkBg) {
        col = col.brighten(0.4);
      } else {
        col = col.darken(0.4);
      }
      tries++;
    }
    return col.hex();
  }) as [string, string, string];
  return { ...p, colors: fixed };
}

