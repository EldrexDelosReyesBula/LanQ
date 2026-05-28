import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { QRPreview } from "@/features/generator/QRPreview";
import { PALETTES, ensureReadable, type Palette } from "@/features/autoBlend/palettes";
import { db } from "@/features/storage/db";
import { defaultConfig } from "@/features/generator/types";

export function Generator() {
  const [url, setUrl] = useState(() => typeof window !== "undefined" ? `${window.location.origin}/showcase` : "https://lanq.landecs.org/showcase");
  const [palette, setPalette] = useState<Palette>(ensureReadable(PALETTES[0]));
  const [corner, setCorner] = useState(70);
  const [dot, setDot] = useState(50);
  const navigate = useNavigate();

  const handleOpenInStudio = async () => {
    const now = Date.now();

    // Map corner and dot slider values to standard QRConfig types
    let dotsType: any = "rounded";
    if (dot < 20) dotsType = "dots";
    else if (dot < 40) dotsType = "square";
    else if (dot < 65) dotsType = "rounded";
    else if (dot < 85) dotsType = "classy";
    else dotsType = "extra-rounded";

    let cornersSquareType: any = "extra-rounded";
    if (corner < 25) cornersSquareType = "square";
    else if (corner < 70) cornersSquareType = "dot";
    else cornersSquareType = "extra-rounded";

    const config = {
      ...defaultConfig,
      data: url,
      backgroundColor: palette.background,
      dotsType,
      cornersSquareType,
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
    <section id="generator" className="px-6 md:px-8 py-20 md:py-24 bg-surface/60 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary">
            Auto-blend Engine
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mt-3">
            Three colors. One harmonic gradient. Zero broken scans.
          </h2>
          <p className="text-foreground/60 mt-3 text-pretty">
            Pick a palette and watch the QR rebuild in real time. Finder patterns stay sharp; contrast stays above 4.5:1.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">
                Destination
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/25 font-medium"
              />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">
                Try a Palette
              </span>
              <div className="flex flex-wrap gap-3 mt-3">
                {PALETTES.slice(0, 4).map((p) => {
                  const safe = ensureReadable(p);
                  const active = safe.id === palette.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPalette(safe)}
                      className={`size-12 rounded-full transition-all cursor-pointer ${
                        active
                          ? "ring-4 ring-primary/20 scale-110"
                          : "ring-4 ring-transparent hover:ring-foreground/5"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${safe.colors[0]}, ${safe.colors[1]}, ${safe.colors[2]})`,
                      }}
                      aria-label={p.name}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Slider label="Corner Radius" value={corner} onChange={setCorner} />
              <Slider label="Dot Scale" value={dot} onChange={setDot} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenInStudio}
                className="w-full py-4 px-6 rounded-2xl bg-prism text-white font-bold text-base shadow-prism hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center min-h-[44px] cursor-pointer"
              >
                Open in Studio
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className="aspect-square rounded-[2rem] p-6 border border-border shadow-soft"
              style={{ background: palette.background }}
            >
              <QRPreview
                data={url}
                palette={palette}
                size={420}
                className="[&_svg]:w-full [&_svg]:h-full"
                corner={corner}
                dot={dot}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, onChange,
}: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="p-4 bg-card rounded-2xl border border-border block">
      <span className="text-xs font-semibold text-foreground/60 mb-3 block">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-primary)]"
      />
    </label>
  );
}
