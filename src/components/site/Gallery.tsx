import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { QRPreview } from "@/features/generator/QRPreview";
import { PALETTES, ensureReadable, type Palette } from "@/features/autoBlend/palettes";
import { db } from "@/features/storage/db";
import { defaultConfig } from "@/features/generator/types";

type Props = {
  isLanding?: boolean;
};

export function Gallery({ isLanding = true }: Props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "solid" | "linear" | "radial">("all");

  const handleRemix = async (palette: Palette) => {
    const now = Date.now();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://lanq.studio";

    let dotsFill: any = {
      mode: "gradient" as const,
      gradientType: "linear" as const,
      rotation: Math.PI / 4,
      stops: [
        { offset: 0, color: palette.colors[0] },
        { offset: 0.5, color: palette.colors[1] },
        { offset: 1, color: palette.colors[2] },
      ],
    };

    if (palette.fillType === "solid") {
      dotsFill = {
        mode: "solid" as const,
        color: palette.colors[0],
      };
    } else if (palette.fillType === "radial") {
      dotsFill = {
        mode: "gradient" as const,
        gradientType: "radial" as const,
        rotation: 0,
        stops: [
          { offset: 0, color: palette.colors[0] },
          { offset: 0.5, color: palette.colors[1] },
          { offset: 1, color: palette.colors[2] },
        ],
      };
    }

    const config = {
      ...defaultConfig,
      data: `${origin}/${palette.id}`,
      backgroundColor: palette.background,
      dotsFill,
      cornersSquareColor: palette.colors[0],
      cornersDotColor: palette.colors[2] || palette.colors[0],
    };

    await db.projects.put({
      id: 1,
      name: `Remix: ${palette.name}`,
      config,
      createdAt: now,
      updatedAt: now,
    });
    navigate({ to: "/studio" });
  };

  const filteredPalettes = PALETTES.filter((p) => {
    if (isLanding) return false;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || p.fillType === activeTab;
    return matchesSearch && matchesTab;
  });

  const landingTeaserPalettes = [
    PALETTES.find((p) => p.id === "bloom"),
    PALETTES.find((p) => p.id === "solid-cyberpunk"),
    PALETTES.find((p) => p.id === "cosmic"),
  ].filter(Boolean) as Palette[];

  const displayedPalettes = isLanding 
    ? landingTeaserPalettes 
    : filteredPalettes;

  return (
    <section id="gallery" className="px-6 md:px-8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">The Studio</span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mt-3">
              Visual Inspiration
            </h2>
            <p className="text-foreground/50 mt-2">Curated presets for identity and design.</p>
          </div>
          {isLanding ? (
            <Link to="/gallery" className="text-primary font-bold flex items-center gap-2 group text-sm md:text-base cursor-pointer">
              Explore more...
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : (
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
              />
            </div>
          )}
        </div>

        {/* Tab switchers on Gallery Page */}
        {!isLanding && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-5 mb-10">
            {(["all", "solid", "linear", "radial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize cursor-pointer select-none ${
                  activeTab === tab
                    ? "bg-foreground text-background shadow-soft"
                    : "text-foreground/60 hover:text-foreground hover:bg-surface/50"
                }`}
              >
                {tab === "all" ? "All Styles" : tab === "solid" ? "Solid Colors" : tab === "linear" ? "Linear Gradient" : "Radial Gradient"}
              </button>
            ))}
          </div>
        )}

        {displayedPalettes.length === 0 ? (
          <div className="text-center py-20 bg-surface/50 rounded-2xl border border-dashed border-border">
            <p className="text-foreground/45 font-medium">No presets found matching "{searchQuery}" in this style.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedPalettes.map((p) => {
              const safe = ensureReadable(p);
              return (
                <div
                  key={p.id}
                  onClick={() => handleRemix(safe)}
                  className="group cursor-pointer"
                >
                  <div
                    className="w-full aspect-square rounded-[2rem] p-6 border border-border shadow-soft transition-all duration-500 group-hover:scale-[0.98] group-hover:shadow-prism"
                    style={{ background: safe.background }}
                  >
                    <QRPreview
                      data={`${typeof window !== "undefined" ? window.location.origin : "https://lanq.studio"}/${safe.id}`}
                      palette={safe}
                      size={340}
                      className="[&_svg]:w-full [&_svg]:h-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-2">
                    <p className="font-semibold">{safe.name}</p>
                    <span className="text-xs font-mono font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Remix &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
