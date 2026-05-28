import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import chroma from "chroma-js";
import { QRPreview, downloadQR } from "@/features/generator/QRPreview";
import { PALETTES, ensureReadable, type Palette } from "@/features/autoBlend/palettes";
import { generateHarmony, suggestBackground } from "@/features/autoBlend/engine";
import { db } from "@/features/storage/db";
import { defaultConfig } from "@/features/generator/types";

export function Hero() {
  const [url, setUrl] = useState(() => typeof window !== "undefined" ? window.location.origin : "https://lanq.landecs.org");
  const [palette, setPalette] = useState<Palette>(ensureReadable(PALETTES[3]));
  const navigate = useNavigate();

  const handleAutoBlend = () => {
    // Generate harmonious colors using the common dynamic color generator
    const colors = generateHarmony();
    const bg = suggestBackground(colors);

    const newPalette: Palette = {
      id: `dynamic-${Date.now()}`,
      name: "Dynamic Auto",
      colors,
      background: bg,
    };

    setPalette(ensureReadable(newPalette));
  };

  const handleOpenInStudio = async () => {
    const now = Date.now();
    const config = {
      ...defaultConfig,
      data: url,
      backgroundColor: palette.background,
      dotsFill: {
        mode: "gradient" as const,
        gradientType: "linear" as const,
        rotation: Math.PI / 4,
        stops: [
          { offset: 0, color: palette.colors[0] },
          { offset: 0.5, color: palette.colors[1] },
          { offset: 1, color: palette.colors[2] },
        ]
      },
      cornersSquareColor: palette.colors[0],
      cornersDotColor: palette.colors[2],
    };
    await db.projects.put({
      id: 1,
      name: "Generated QR",
      config,
      createdAt: now,
      updatedAt: now
    });
    navigate({ to: "/studio" });
  };

  return (
    <section className="relative px-6 md:px-8 pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[520px] -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent), radial-gradient(50% 40% at 90% 10%, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent)",
        }}
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[0.95] mb-7">
            A better way to <span className="text-prism">be seen.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-xl text-pretty mb-10">
            LanQ transforms functional utility into brand identity. Precise, beautiful, and effortless — designed locally, owned by you.
          </p>

          <div className="p-2 bg-surface rounded-2xl md:rounded-[2rem] border border-border shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:ring-2 focus-within:ring-primary/25 transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your URL…"
              className="flex-1 min-w-0 bg-transparent border-none outline-none px-4 md:px-5 py-3 md:py-3.5 font-medium text-base md:text-lg placeholder:text-foreground/30 min-h-[44px]"
            />
            <button
              onClick={handleAutoBlend}
              className="shrink-0 px-6 md:px-8 py-3.5 rounded-xl md:rounded-[1.5rem] bg-prism text-white font-bold tracking-tight hover:opacity-95 transition-all active:scale-95 shadow-prism flex items-center justify-center min-h-[44px]"
            >
              Auto-blend
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/40 sm:mr-2 shrink-0">
              Try a palette
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {PALETTES.slice(0, 4).map((p) => {
                const safe = ensureReadable(p);
                const active = safe.id === palette.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPalette(safe)}
                    aria-label={p.name}
                    className={`relative size-9 rounded-full transition-all min-w-[36px] min-h-[36px] cursor-pointer ${
                      active ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${safe.colors[0]}, ${safe.colors[1]}, ${safe.colors[2]})`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div className="relative w-full">
            <div
              className="aspect-square rounded-[2.5rem] p-6 md:p-8 shadow-prism border border-border relative overflow-hidden"
              style={{ background: palette.background }}
            >
              <QRPreview data={url} palette={palette} size={420} className="[&_svg]:w-full [&_svg]:h-full" />
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -right-3 md:-right-6 p-4 bg-card rounded-2xl shadow-soft border border-border"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 block mb-1">
                Readability
              </span>
              <span className="font-display font-bold text-emerald-soft">100% Perfect</span>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center w-full">
            <button
              onClick={handleOpenInStudio}
              className="w-full max-w-sm px-8 py-3.5 rounded-2xl bg-prism text-white font-bold text-sm md:text-base shadow-prism hover:opacity-95 active:scale-95 transition-all text-center"
            >
              Open in Studio
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
