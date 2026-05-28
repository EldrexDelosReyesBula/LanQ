// Composes the final image (QR + frame + text + effects) onto a canvas at a given pixel scale.
import { makeQR } from "./buildQR";
import type { FrameConfig, QRConfig, TextConfig } from "./types";

export interface ComposeOptions {
  scale: 1 | 2 | 4;
  baseSize?: number; // unscaled px (default 480)
}

interface Layout {
  totalW: number;
  totalH: number;
  qrX: number;
  qrY: number;
  qrSize: number;
  framePad: number;
  topTextBand: number;
  bottomTextBand: number;
}

function computeLayout(cfg: QRConfig, base: number): Layout {
  const qrSize = base;
  const framePad = cfg.frame.preset === "none" ? 0 : cfg.frame.padding;
  const topTextBand =
    cfg.text.position === "top" && cfg.text.value
      ? Math.round(cfg.text.size * 2.2)
      : 0;
  const labelBand =
    cfg.frame.preset !== "none" && cfg.frame.label
      ? Math.round(36)
      : 0;
  const bottomTextBand =
    cfg.text.position === "bottom" && cfg.text.value
      ? Math.round(cfg.text.size * 2.2)
      : 0;
  const totalW = qrSize + framePad * 2;
  const totalH = qrSize + framePad * 2 + topTextBand + bottomTextBand + labelBand;
  return {
    totalW,
    totalH,
    qrX: framePad,
    qrY: framePad + topTextBand,
    qrSize,
    framePad,
    topTextBand,
    bottomTextBand: bottomTextBand + labelBand,
  };
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: FrameConfig,
  L: Layout,
  s: number,
  bg: string,
) {
  if (frame.preset === "none") return;
  const r = frame.radius * s;
  const x = 0, y = 0, w = L.totalW * s, h = L.totalH * s;

  ctx.save();
  // base fill
  if (frame.preset === "glass") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, withAlpha(frame.color, 0.85));
    g.addColorStop(1, withAlpha(frame.accent, 0.6));
    ctx.fillStyle = g;
  } else if (frame.preset === "gradient") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, frame.color);
    g.addColorStop(1, frame.accent);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = frame.color;
  }
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();

  if (frame.borderWidth > 0 && frame.preset !== "minimal") {
    ctx.strokeStyle = frame.accent;
    ctx.lineWidth = frame.borderWidth * s;
    roundRect(ctx, x + 1, y + 1, w - 2, h - 2, r);
    ctx.stroke();
  }
  if (frame.preset === "minimal") {
    ctx.strokeStyle = frame.accent;
    ctx.lineWidth = Math.max(1, frame.borderWidth) * s;
    roundRect(ctx, x + 4 * s, y + 4 * s, w - 8 * s, h - 8 * s, r);
    ctx.stroke();
  }

  // CTA label
  if (frame.label && (frame.preset === "poster" || frame.preset === "scan-cta")) {
    const bandY = (L.qrY + L.qrSize + L.framePad / 2) * s;
    ctx.fillStyle = frame.accent;
    const pillW = 220 * s, pillH = 44 * s;
    const pillX = (w - pillW) / 2;
    roundRect(ctx, pillX, bandY, pillW, pillH, 22 * s);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `${800} ${16 * s}px Sora, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(frame.label.toUpperCase(), w / 2, bandY + pillH / 2 + 1 * s);
  }
  // discard bg ref to avoid unused warning
  void bg;
  ctx.restore();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: TextConfig,
  L: Layout,
  s: number,
) {
  if (text.position === "none" || !text.value) return;
  ctx.save();
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${text.size * s}px ${text.font}, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = (L.totalW / 2) * s;
  if (text.position === "top") {
    ctx.fillText(text.value, cx, (L.framePad + L.topTextBand / 2) * s);
  } else {
    const y = (L.qrY + L.qrSize + L.framePad + L.bottomTextBand / 2) * s;
    ctx.fillText(text.value, cx, y);
  }
  ctx.restore();
}

function applyEffects(
  ctx: CanvasRenderingContext2D,
  qrCanvas: HTMLCanvasElement,
  cfg: QRConfig,
  L: Layout,
  s: number,
) {
  const x = L.qrX * s, y = L.qrY * s, w = L.qrSize * s, h = L.qrSize * s;
  if (cfg.effects.glow > 0) {
    ctx.save();
    ctx.shadowColor = cfg.cornersSquareColor;
    ctx.shadowBlur = cfg.effects.glow * s;
    ctx.drawImage(qrCanvas, x, y, w, h);
    ctx.restore();
  }
  if (cfg.effects.shadow > 0) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = cfg.effects.shadow * s;
    ctx.shadowOffsetY = (cfg.effects.shadow / 2) * s;
    ctx.drawImage(qrCanvas, x, y, w, h);
    ctx.restore();
  }
  ctx.drawImage(qrCanvas, x, y, w, h);

  if (cfg.effects.noise > 0) {
    const id = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = id.data;
    const intensity = cfg.effects.noise * 255;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * intensity;
      data[i] = clamp(data[i] + n);
      data[i + 1] = clamp(data[i + 1] + n);
      data[i + 2] = clamp(data[i + 2] + n);
    }
    ctx.putImageData(id, 0, 0);
  }
}

export async function composeCanvas(
  cfg: QRConfig,
  opts: ComposeOptions,
): Promise<HTMLCanvasElement> {
  const base = opts.baseSize ?? 480;
  const s = opts.scale;
  const L = computeLayout(cfg, base);

  // 1) Render QR to a transparent SVG, then rasterize to canvas at scaled size.
  const qrPx = L.qrSize * s;
  const qr = makeQR({ ...cfg, backgroundColor: "transparent" }, qrPx);
  const blob = (await qr.getRawData("svg")) as Blob;
  const url = URL.createObjectURL(blob);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);

  const qrCanvas = document.createElement("canvas");
  qrCanvas.width = qrPx;
  qrCanvas.height = qrPx;
  qrCanvas.getContext("2d")!.drawImage(img, 0, 0, qrPx, qrPx);

  // 2) Compose final canvas.
  const canvas = document.createElement("canvas");
  canvas.width = L.totalW * s;
  canvas.height = L.totalH * s;
  const ctx = canvas.getContext("2d")!;

  // bg
  if (cfg.frame.preset === "none") {
    ctx.fillStyle = cfg.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    drawFrame(ctx, cfg.frame, L, s, cfg.backgroundColor);
    // QR background plate
    ctx.fillStyle = cfg.backgroundColor;
    roundRect(
      ctx,
      L.qrX * s,
      L.qrY * s,
      L.qrSize * s,
      L.qrSize * s,
      Math.max(8, cfg.frame.radius - 12) * s,
    );
    ctx.fill();
  }

  applyEffects(ctx, qrCanvas, cfg, L, s);
  drawText(ctx, cfg.text, L, s);

  return canvas;
}

/* ---------- helpers ---------- */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}
function clamp(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}
function withAlpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
