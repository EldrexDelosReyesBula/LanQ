import { useEffect, useMemo, useRef, useState } from "react";
import chroma from "chroma-js";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useQRStore } from "@/features/generator/store";
import { QRCanvas } from "@/features/generator/QRCanvas";
import { ScannerPreview } from "@/features/generator/ScannerPreview";
import type { ColorFill, QRConfig, FramePreset, TextPosition } from "@/features/generator/types";
import { db } from "@/features/storage/db";
import { autoBlend } from "@/features/autoBlend/engine";
import { extractPalette } from "@/features/autoBlend/imagePalette";
import { exportDesign, type ExportScale } from "@/features/generator/exporter";

type DotType = QRConfig["dotsType"];
type CornerSquareType = QRConfig["cornersSquareType"];
type CornerDotType = QRConfig["cornersDotType"];
type EC = QRConfig["ecLevel"];

const DOT_TYPES: DotType[] = ["square","rounded","dots","classy","classy-rounded","extra-rounded"];
const CORNER_SQUARE: CornerSquareType[] = ["square","dot","extra-rounded"];
const CORNER_DOT: CornerDotType[] = ["square","dot"];
const EC_LEVELS: EC[] = ["L","M","Q","H"];
const FRAMES: FramePreset[] = ["none","minimal","soft","glass","gradient","poster","scan-cta"];
const FONTS = ["Sora","Inter","Manrope","JetBrains Mono"] as const;

type Tab = "design" | "frame" | "text" | "advanced" | "preview";

export function Studio() {
  const { config, set, replace, reset } = useQRStore();
  const [projectName, setProjectName] = useState("Untitled");
  const [tab, setTab] = useState<Tab>("design");
  const [blending, setBlending] = useState(false);
  const [paletteHint, setPaletteHint] = useState<string[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const paletteFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSavedProject = async () => {
      const saved = await db.projects.get(1);
      if (saved) {
        replace(saved.config);
        setProjectName(saved.name);
      }
    };
    loadSavedProject();
  }, [replace]);

  // ---------- Contrast ----------
  const contrast = useMemo(() => {
    try {
      const bg = chroma(config.backgroundColor);
      const sample = config.dotsFill.mode === "solid"
        ? config.dotsFill.color
        : config.dotsFill.stops[0].color;
      return chroma.contrast(chroma(sample), bg);
    } catch { return 0; }
  }, [config.backgroundColor, config.dotsFill]);
  const scanSafe = contrast >= 3.5;

  // ---------- Logo ----------
  const onLogoChange = (file?: File) => {
    if (!file) { set("logo", undefined); return; }
    const reader = new FileReader();
    reader.onload = () => set("logo", String(reader.result));
    reader.readAsDataURL(file);
  };

  // ---------- Image palette ----------
  const onPaletteImage = async (file?: File) => {
    if (!file) return;
    const p = await extractPalette(file);
    const seed = [p.dominant, p.vibrant, p.accent];
    setPaletteHint(seed);
    triggerBlend(seed);
  };

  // ---------- Auto-blend ----------
  const triggerBlend = (seed?: string[]) => {
    setBlending(true);
    setTimeout(() => {
      replace(autoBlend(config, seed));
      setTimeout(() => setBlending(false), 600);
    }, 200);
  };

  // ---------- Exports ----------
  const [exportScale, setExportScale] = useState<ExportScale>(2);
  const exporting = useRef(false);
  const doExport = async (fmt: "png"|"svg"|"jpeg"|"pdf") => {
    if (exporting.current) return;
    exporting.current = true;
    try { await exportDesign(config, projectName, fmt, exportScale); }
    finally { exporting.current = false; }
  };

  // ---------- Save/Reset ----------
  const save = async () => {
    const now = Date.now();
    await db.projects.put({ id: 1, name: projectName || "Untitled", config, createdAt: now, updatedAt: now });
    toast.success("Design saved successfully!");
  };

  const handleReset = async () => {
    reset();
    setProjectName("Untitled");
    await db.projects.delete(1);
    toast.info("Design reset to defaults.");
  };

  const fill = config.dotsFill;
  const setFill = (f: ColorFill) => set("dotsFill", f);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-border bg-background/85 backdrop-blur">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="https://eldrex.landecs.org/logo/lanq-studio-logo.png"
            alt="LanQ Studio Logo"
            className="h-8 md:h-9 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="flex items-center gap-1.5 md:gap-3">
          <button onClick={() => triggerBlend(paletteHint || undefined)}
            aria-label="Auto-blend"
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-prism text-white text-xs md:text-sm font-semibold shadow-prism hover:opacity-95 active:scale-95 transition-all">
            <span>✨</span>
            <span>Auto-blend</span>
          </button>
          <button onClick={save}
            className="px-3 md:px-4.5 py-1.5 md:py-2 rounded-xl bg-foreground text-background text-xs md:text-sm font-semibold hover:bg-foreground/90 active:scale-95 transition-all">
            Save
          </button>
          <button onClick={handleReset}
            className="px-3 md:px-4.5 py-1.5 md:py-2 rounded-xl bg-surface border border-border text-foreground/70 text-xs md:text-sm font-semibold hover:border-destructive hover:text-destructive active:scale-95 transition-all">
            Reset
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-[360px_1fr] lg:min-h-[calc(100dvh-57px)]">
        {/* LEFT — Controls (tabs) */}
        <aside className="order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-border bg-background">
          <nav className="flex gap-1 px-3 pt-3 overflow-x-auto">
            {(["design","frame","text","advanced","preview"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  tab === t
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:bg-surface"
                }`}>
                {t}
              </button>
            ))}
          </nav>

          <div className="p-4 md:p-5 space-y-7 max-h-[60vh] lg:max-h-[calc(100dvh-110px)] overflow-y-auto">
            {tab === "design" && (
              <>
                <Group title="Content">
                  <Label>Destination</Label>
                  <textarea
                    value={config.data}
                    maxLength={1800}
                    onChange={(e) => set("data", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border outline-none focus:ring-2 focus:ring-primary/25 text-sm"
                    placeholder="https://… or any text" />
                  <Row>
                    <Pill label="EC">
                      <select value={config.ecLevel}
                        onChange={(e) => set("ecLevel", e.target.value as EC)}
                        className="bg-transparent text-sm font-semibold outline-none">
                        {EC_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Pill>
                    <Pill label="Margin">
                      <input type="number" min={0} max={64} value={config.margin}
                        onChange={(e) => set("margin", Math.max(0, Math.min(64, +e.target.value || 0)))}
                        className="w-12 bg-transparent text-sm font-semibold outline-none" />
                    </Pill>
                  </Row>
                </Group>

                <Group title="Inspire from image">
                  <input ref={paletteFileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => onPaletteImage(e.target.files?.[0])} />
                  <button onClick={() => paletteFileRef.current?.click()}
                    className="w-full py-2.5 rounded-lg bg-prism text-white text-sm font-semibold hover:opacity-90">
                    Extract palette from photo
                  </button>
                  {paletteHint && (
                    <div className="flex gap-1 mt-2">
                      {paletteHint.map((c) => (
                        <div key={c} className="flex-1 h-8 rounded-md" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                </Group>

                <Group title="Dots">
                  <Label>Shape</Label>
                  <Grid>
                    {DOT_TYPES.map((t) => (
                      <Chip key={t} active={config.dotsType === t} onClick={() => set("dotsType", t)}>{t}</Chip>
                    ))}
                  </Grid>

                  <Label className="mt-4">Fill</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Chip active={fill.mode === "solid"}
                      onClick={() => setFill({ mode: "solid", color: fill.mode === "solid" ? fill.color : "#1c1917" })}>Solid</Chip>
                    <Chip active={fill.mode === "gradient" && fill.gradientType === "linear"}
                      onClick={() => setFill({ mode: "gradient", gradientType: "linear", rotation: Math.PI/4,
                        stops: fill.mode === "gradient" ? fill.stops : [{offset:0,color:"#7c3aed"},{offset:1,color:"#f59e0b"}] })}>Linear</Chip>
                    <Chip active={fill.mode === "gradient" && fill.gradientType === "radial"}
                      onClick={() => setFill({ mode: "gradient", gradientType: "radial", rotation: 0,
                        stops: fill.mode === "gradient" ? fill.stops : [{offset:0,color:"#ec4899"},{offset:1,color:"#7c3aed"}] })}>Radial</Chip>
                  </div>

                  {fill.mode === "solid" ? (
                    <div className="mt-3"><ColorInput value={fill.color}
                      onChange={(c) => setFill({ mode: "solid", color: c })} /></div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {fill.stops.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ColorInput value={s.color} onChange={(c) => {
                            const stops = fill.stops.map((x, j) => j===i ? {...x, color: c} : x);
                            setFill({ ...fill, stops });
                          }} />
                          <input type="number" min={0} max={1} step={0.01} value={s.offset}
                            onChange={(e) => {
                              const stops = fill.stops.map((x, j) => j===i ? {...x, offset: Math.max(0, Math.min(1, +e.target.value||0))} : x);
                              setFill({ ...fill, stops });
                            }}
                            className="w-16 px-2 py-1 rounded-md bg-surface border border-border text-xs" />
                          {fill.stops.length > 2 && (
                            <button onClick={() => setFill({ ...fill, stops: fill.stops.filter((_,j)=>j!==i) })}
                              className="text-xs text-foreground/40 hover:text-destructive">✕</button>
                          )}
                        </div>
                      ))}
                      {fill.stops.length < 4 && (
                        <button onClick={() => setFill({ ...fill,
                          stops: [...fill.stops, {offset:1,color:"#000000"}].map((s,i,a)=>({...s, offset: i/(a.length-1)})) })}
                          className="text-xs text-primary font-semibold">+ Add stop</button>
                      )}
                      {fill.gradientType === "linear" && (
                        <div>
                          <Label>Rotation: {Math.round((fill.rotation*180)/Math.PI)}°</Label>
                          <input type="range" min={0} max={Math.PI*2} step={0.01} value={fill.rotation}
                            onChange={(e)=>setFill({ ...fill, rotation: +e.target.value })}
                            className="w-full accent-[var(--color-primary)]" />
                        </div>
                      )}
                    </div>
                  )}
                </Group>

                <Group title="Corners">
                  <Label>Square</Label>
                  <Grid>
                    {CORNER_SQUARE.map((t)=>(
                      <Chip key={t} active={config.cornersSquareType===t} onClick={()=>set("cornersSquareType", t)}>{t}</Chip>
                    ))}
                  </Grid>
                  <div className="mt-2"><ColorInput value={config.cornersSquareColor} onChange={(c)=>set("cornersSquareColor", c)} /></div>

                  <Label className="mt-4">Inner dot</Label>
                  <Grid>
                    {CORNER_DOT.map((t)=>(
                      <Chip key={t} active={config.cornersDotType===t} onClick={()=>set("cornersDotType", t)}>{t}</Chip>
                    ))}
                  </Grid>
                  <div className="mt-2"><ColorInput value={config.cornersDotColor} onChange={(c)=>set("cornersDotColor", c)} /></div>
                </Group>

                <Group title="Background">
                  <ColorInput value={config.backgroundColor} onChange={(c)=>set("backgroundColor", c)} />
                </Group>

                <Group title="Logo">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e)=>onLogoChange(e.target.files?.[0])} />
                  <div className="flex gap-2">
                    <button onClick={()=>fileRef.current?.click()}
                      className="flex-1 py-2 rounded-lg bg-surface border border-border text-sm font-semibold hover:border-primary">
                      {config.logo ? "Replace" : "Upload"}
                    </button>
                    {config.logo && (
                      <button onClick={()=>onLogoChange(undefined)}
                        className="px-3 py-2 rounded-lg bg-surface border border-border text-sm hover:text-destructive">Remove</button>
                    )}
                  </div>
                  {config.logo && (
                    <>
                      <Label className="mt-3">Size: {Math.round(config.logoSize*100)}%</Label>
                      <input type="range" min={0.1} max={0.5} step={0.01} value={config.logoSize}
                        onChange={(e)=>set("logoSize", +e.target.value)}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-2">Padding: {config.logoMargin}px</Label>
                      <input type="range" min={0} max={20} step={1} value={config.logoMargin}
                        onChange={(e)=>set("logoMargin", +e.target.value)}
                        className="w-full accent-[var(--color-primary)]" />
                      <label className="flex items-center gap-2 mt-3 text-xs">
                        <input type="checkbox" checked={config.hideDotsBehindLogo}
                          onChange={(e)=>set("hideDotsBehindLogo", e.target.checked)} />
                        Hide dots behind logo
                      </label>
                    </>
                  )}
                </Group>
              </>
            )}

            {tab === "frame" && (
              <>
                <Group title="Frame style">
                  <Grid>
                    {FRAMES.map((p)=>(
                      <Chip key={p} active={config.frame.preset===p}
                        onClick={()=>set("frame", { ...config.frame, preset: p })}>{p}</Chip>
                    ))}
                  </Grid>
                </Group>
                {config.frame.preset !== "none" && (
                  <>
                    <Group title="Frame colors">
                      <Label>Base</Label>
                      <ColorInput value={config.frame.color}
                        onChange={(c)=>set("frame", { ...config.frame, color: c })} />
                      <Label className="mt-3">Accent</Label>
                      <ColorInput value={config.frame.accent}
                        onChange={(c)=>set("frame", { ...config.frame, accent: c })} />
                    </Group>
                    <Group title="Shape">
                      <Label>Radius: {config.frame.radius}px</Label>
                      <input type="range" min={0} max={64} value={config.frame.radius}
                        onChange={(e)=>set("frame", { ...config.frame, radius: +e.target.value })}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-2">Padding: {config.frame.padding}px</Label>
                      <input type="range" min={8} max={80} value={config.frame.padding}
                        onChange={(e)=>set("frame", { ...config.frame, padding: +e.target.value })}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-2">Border: {config.frame.borderWidth}px</Label>
                      <input type="range" min={0} max={8} value={config.frame.borderWidth}
                        onChange={(e)=>set("frame", { ...config.frame, borderWidth: +e.target.value })}
                        className="w-full accent-[var(--color-primary)]" />
                    </Group>
                    {(config.frame.preset === "poster" || config.frame.preset === "scan-cta") && (
                      <Group title="Call to action">
                        <input type="text" value={config.frame.label} maxLength={20}
                          onChange={(e)=>set("frame", { ...config.frame, label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm font-semibold tracking-widest outline-none focus:ring-2 focus:ring-primary/25"
                          placeholder="SCAN ME" />
                      </Group>
                    )}
                  </>
                )}
              </>
            )}

            {tab === "text" && (
              <>
                <Group title="Position">
                  <Grid>
                    {(["none","top","bottom"] as TextPosition[]).map((p)=>(
                      <Chip key={p} active={config.text.position===p}
                        onClick={()=>set("text", { ...config.text, position: p })}>{p}</Chip>
                    ))}
                  </Grid>
                </Group>
                {config.text.position !== "none" && (
                  <>
                    <Group title="Content">
                      <input type="text" value={config.text.value} maxLength={60}
                        onChange={(e)=>set("text", { ...config.text, value: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm outline-none focus:ring-2 focus:ring-primary/25"
                        placeholder="Your message" />
                    </Group>
                    <Group title="Typography">
                      <Label>Font</Label>
                      <select value={config.text.font}
                        onChange={(e)=>set("text", { ...config.text, font: e.target.value as typeof FONTS[number] })}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm">
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <Label className="mt-3">Weight: {config.text.weight}</Label>
                      <input type="range" min={400} max={800} step={100} value={config.text.weight}
                        onChange={(e)=>set("text", { ...config.text, weight: +e.target.value as 400|500|600|700|800 })}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-2">Size: {config.text.size}px</Label>
                      <input type="range" min={10} max={48} value={config.text.size}
                        onChange={(e)=>set("text", { ...config.text, size: +e.target.value })}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-2">Letter spacing: {config.text.letterSpacing}px</Label>
                      <input type="range" min={-2} max={8} step={0.5} value={config.text.letterSpacing}
                        onChange={(e)=>set("text", { ...config.text, letterSpacing: +e.target.value })}
                        className="w-full accent-[var(--color-primary)]" />
                      <Label className="mt-3">Color</Label>
                      <ColorInput value={config.text.color}
                        onChange={(c)=>set("text", { ...config.text, color: c })} />
                    </Group>
                  </>
                )}
              </>
            )}

            {tab === "advanced" && (
              <>
                <Group title="Effects">
                  <Label>Glow: {config.effects.glow}</Label>
                  <input type="range" min={0} max={30} value={config.effects.glow}
                    onChange={(e)=>set("effects", { ...config.effects, glow: +e.target.value })}
                    className="w-full accent-[var(--color-primary)]" />
                  <Label className="mt-2">Shadow: {config.effects.shadow}</Label>
                  <input type="range" min={0} max={40} value={config.effects.shadow}
                    onChange={(e)=>set("effects", { ...config.effects, shadow: +e.target.value })}
                    className="w-full accent-[var(--color-primary)]" />
                  <Label className="mt-2">Noise: {Math.round(config.effects.noise*100)}%</Label>
                  <input type="range" min={0} max={0.3} step={0.01} value={config.effects.noise}
                    onChange={(e)=>set("effects", { ...config.effects, noise: +e.target.value })}
                    className="w-full accent-[var(--color-primary)]" />
                </Group>

                <Group title="Steganography">
                  <p className="text-xs text-foreground/50 leading-relaxed">
                    Hide invisible metadata (creator info, campaign IDs, signatures) inside PNG/SVG exports. Doesn't affect scan readability.
                  </p>
                  <label className="flex items-center gap-2 mt-2 text-sm font-semibold">
                    <input type="checkbox" checked={config.stego.enabled}
                      onChange={(e)=>set("stego", { ...config.stego, enabled: e.target.checked })} />
                    Enable hidden metadata
                  </label>
                  {config.stego.enabled && (
                    <>
                      <Label className="mt-3">Author / signature</Label>
                      <input type="text" value={config.stego.author} maxLength={60}
                        onChange={(e)=>set("stego", { ...config.stego, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
                      <Label className="mt-2">Campaign / tracking ID</Label>
                      <input type="text" value={config.stego.campaign} maxLength={60}
                        onChange={(e)=>set("stego", { ...config.stego, campaign: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
                      <Label className="mt-2">Hidden message</Label>
                      <textarea value={config.stego.message} maxLength={400} rows={3}
                        onChange={(e)=>set("stego", { ...config.stego, message: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm" />
                    </>
                  )}
                </Group>
              </>
            )}

            {tab === "preview" && (
              <>
                <Group title="Scanner simulation">
                  <p className="text-xs text-foreground/50 mb-3 leading-relaxed">
                    Test how your QR appears across cameras and conditions.
                  </p>
                  <ScannerPreview config={config} />
                </Group>
                <Group title="Readability score">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="text-2xl font-display font-extrabold">
                      {contrast.toFixed(2)}<span className="text-sm text-foreground/40">:1</span>
                    </div>
                    <p className={`text-xs font-mono mt-1 ${scanSafe ? "text-emerald-600" : "text-destructive"}`}>
                      {scanSafe ? "Scan-safe across devices" : "Increase contrast — risky on low-end cameras"}
                    </p>
                  </div>
                </Group>
              </>
            )}
          </div>
        </aside>

        {/* CENTER — Preview */}
        <main className="order-1 lg:order-2 p-4 md:p-8 flex flex-col items-center justify-center bg-surface/30 min-h-[45vh] lg:min-h-[calc(100dvh-57px)] border-b lg:border-b-0 border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(config.dotsFill) + config.backgroundColor + config.frame.preset}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <FramedPreview config={config} />
              {blending && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-prism/30 backdrop-blur-sm">
                  <span className="px-3 py-1.5 rounded-full bg-background text-xs font-mono">
                    Auto-blending…
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono">
            <span className={`size-2 rounded-full ${scanSafe ? "bg-emerald-soft" : "bg-destructive"}`} />
            <span className="text-foreground/60">
              {contrast.toFixed(2)}:1 — {scanSafe ? "Scan-safe" : "Risk of unreadable scan"}
            </span>
          </div>

          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">Quality</span>
              {([1,2,4] as ExportScale[]).map(s => (
                <Chip key={s} active={exportScale===s} onClick={()=>setExportScale(s)}>{s}×</Chip>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button onClick={()=>doExport("svg")}
                className="py-3 rounded-xl bg-card border border-border font-semibold text-sm hover:border-primary transition-colors">SVG</button>
              <button onClick={()=>doExport("png")}
                className="py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-primary transition-colors">PNG</button>
              <button onClick={()=>doExport("jpeg")}
                className="py-3 rounded-xl bg-card border border-border font-semibold text-sm hover:border-primary transition-colors">JPEG</button>
              <button onClick={()=>doExport("pdf")}
                className="py-3 rounded-xl bg-card border border-border font-semibold text-sm hover:border-primary transition-colors">PDF</button>
            </div>
            {config.stego.enabled && (
              <p className="text-[10px] font-mono text-foreground/40 mt-2 text-center">
                Hidden metadata embedded in PNG &amp; SVG exports
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Live framed preview using CSS + QRCanvas ---------- */
function FramedPreview({ config }: { config: QRConfig }) {
  const { frame, text } = config;
  const showFrame = frame.preset !== "none";
  const showTopText = text.position === "top" && text.value;
  const showBottomText = text.position === "bottom" && text.value;

  const frameStyle: React.CSSProperties = showFrame ? (() => {
    switch (frame.preset) {
      case "glass":
        return { background: `linear-gradient(135deg, ${frame.color}dd, ${frame.accent}99)`, backdropFilter: "blur(10px)" };
      case "gradient":
        return { background: `linear-gradient(135deg, ${frame.color}, ${frame.accent})` };
      case "minimal":
        return { background: frame.color, boxShadow: `inset 0 0 0 ${frame.borderWidth}px ${frame.accent}` };
      default:
        return { background: frame.color, border: `${frame.borderWidth}px solid ${frame.accent}` };
    }
  })() : {};

  const shadow = config.effects.shadow > 0
    ? `0 ${config.effects.shadow}px ${config.effects.shadow*2}px rgba(0,0,0,0.25)`
    : "var(--shadow-prism)";

  return (
    <div className="rounded-[2rem] border border-border p-1 overflow-hidden max-w-full flex flex-col items-center justify-center font-sans"
      style={{
        boxShadow: shadow,
        ...frameStyle,
        padding: showFrame 
          ? `calc(${frame.padding}px * clamp(0.55, 100vw / 640, 1))` 
          : "clamp(12px, 4vw, 24px)",
        borderRadius: showFrame ? `calc(${frame.radius}px * clamp(0.7, 100vw / 640, 1))` : 32
      }}>
      {showTopText && (
        <p className="text-center mb-3 text-sm sm:text-base px-2 break-words max-w-full"
          style={{ fontFamily: text.font, fontWeight: text.weight, fontSize: text.size, color: text.color, letterSpacing: text.letterSpacing }}>
          {text.value}
        </p>
      )}
      <div
        className="rounded-2xl overflow-hidden max-w-full flex items-center justify-center"
        style={{
          background: config.backgroundColor,
          padding: "clamp(8px, 2.5vw, 12px)",
          filter: config.effects.glow > 0 ? `drop-shadow(0 0 ${config.effects.glow}px ${config.cornersSquareColor})` : "none",
        }}>
        <QRCanvas config={config} size={360}
          className="[&_svg]:w-[240px] [&_svg]:h-[240px] min-[370px]:[&_svg]:w-[280px] min-[370px]:[&_svg]:h-[280px] sm:[&_svg]:w-[360px] sm:[&_svg]:h-[360px] [&_canvas]:w-[240px] [&_canvas]:h-[240px] min-[370px]:[&_canvas]:w-[280px] min-[370px]:[&_canvas]:h-[280px] sm:[&_canvas]:w-[360px] sm:[&_canvas]:h-[360px]" />
      </div>
      {showBottomText && (
        <p className="text-center mt-3"
          style={{ fontFamily: text.font, fontWeight: text.weight, fontSize: text.size, color: text.color, letterSpacing: text.letterSpacing }}>
          {text.value}
        </p>
      )}
      {(frame.preset === "poster" || frame.preset === "scan-cta") && frame.label && (
        <div className="mt-3 mx-auto w-fit px-4 py-1.5 rounded-full font-bold tracking-widest text-xs text-white"
          style={{ background: frame.accent }}>
          {frame.label.toUpperCase()}
        </div>
      )}
    </div>
  );
}

/* ---------- presentational helpers ---------- */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-foreground/40 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[10px] font-mono uppercase tracking-widest text-foreground/40 block ${className}`}>{children}</span>;
}
function Row({ children }: { children: React.ReactNode }) { return <div className="flex gap-2">{children}</div>; }
function Grid({ children }: { children: React.ReactNode }) { return <div className="flex flex-wrap gap-1.5 mt-1">{children}</div>; }
function Pill({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border flex items-center justify-between">
      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{label}</span>
      {children}
    </div>
  );
}
function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
        active ? "bg-foreground text-background border-foreground"
               : "bg-surface border-border text-foreground/70 hover:border-primary/50"
      }`}>{children}</button>
  );
}
function ColorInput({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface border border-border">
      <input type="color" value={value} onChange={(e)=>onChange(e.target.value)}
        className="size-7 rounded cursor-pointer border-none bg-transparent" />
      <input type="text" value={value} onChange={(e)=>onChange(e.target.value)}
        className="flex-1 bg-transparent text-xs font-mono outline-none" />
    </div>
  );
}
