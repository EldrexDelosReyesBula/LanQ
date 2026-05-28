import { useEffect, useRef, useState } from "react";
import { composeCanvas } from "./composer";
import type { QRConfig } from "./types";

export type ScanScenario = "ideal" | "lowlight" | "blurry" | "tiny" | "glare";

const FILTERS: Record<ScanScenario, string> = {
  ideal: "none",
  lowlight: "brightness(0.45) contrast(0.85)",
  blurry: "blur(1.6px) contrast(0.9)",
  tiny: "none",
  glare: "brightness(1.35) contrast(0.8) saturate(0.9)",
};

const LABELS: Record<ScanScenario, string> = {
  ideal: "Ideal camera",
  lowlight: "Low light",
  blurry: "Blurry / motion",
  tiny: "Tiny on screen",
  glare: "Glare / overexposed",
};

export function ScannerPreview({ config }: { config: QRConfig }) {
  const [scenario, setScenario] = useState<ScanScenario>("ideal");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await composeCanvas(config, { scale: 1, baseSize: 240 });
      if (!mounted || !canvasRef.current) return;
      const out = canvasRef.current;
      out.width = c.width;
      out.height = c.height;
      const ctx = out.getContext("2d")!;
      ctx.clearRect(0, 0, out.width, out.height);
      ctx.filter = FILTERS[scenario];
      ctx.drawImage(c, 0, 0);
      ctx.filter = "none";
    })();
    return () => { mounted = false; };
  }, [config, scenario]);

  const size = scenario === "tiny" ? 80 : 160;

  return (
    <div>
      <div className="grid grid-cols-5 gap-1 mb-3">
        {(Object.keys(LABELS) as ScanScenario[]).map((s) => (
          <button key={s}
            onClick={() => setScenario(s)}
            title={LABELS[s]}
            className={`px-1.5 py-1 rounded-md text-[10px] font-semibold border transition-colors ${
              scenario === s
                ? "bg-foreground text-background border-foreground"
                : "bg-surface border-border text-foreground/60 hover:border-primary/40"
            }`}>
            {LABELS[s].split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center p-4 rounded-xl bg-foreground/5 border border-border">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: "auto" }}
          className="rounded-md"
        />
      </div>
      <p className="text-[10px] font-mono text-foreground/40 mt-2 text-center">
        Simulating: {LABELS[scenario]}
      </p>
    </div>
  );
}
