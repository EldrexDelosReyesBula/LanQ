import jsPDF from "jspdf";
import { composeCanvas } from "./composer";
import { buildStegoPayload, embedInPng, embedInSvg } from "./steganography";
import { makeQR } from "./buildQR";
import type { QRConfig } from "./types";

export type ExportFormat = "png" | "svg" | "jpeg" | "pdf";
export type ExportScale = 1 | 2 | 4;

function dl(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportDesign(
  cfg: QRConfig,
  name: string,
  format: ExportFormat,
  scale: ExportScale = 2,
) {
  const safeName = name.replace(/[^\w-]+/g, "-") || "lanq-qr";

  if (format === "svg") {
    // Pure SVG export (skips raster effects but supports frame-less QR)
    const qr = makeQR(cfg, 1024);
    let raw = (await qr.getRawData("svg")) as Blob;
    let svg = await raw.text();
    if (cfg.stego.enabled) {
      svg = embedInSvg(svg, buildStegoPayload(cfg.stego));
    }
    dl(new Blob([svg], { type: "image/svg+xml" }), `${safeName}.svg`);
    return;
  }

  const canvas = await composeCanvas(cfg, { scale });

  if (format === "pdf") {
    const dataUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${safeName}.pdf`);
    return;
  }

  const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b!), mime, 0.95),
  );

  let final = blob;
  if (format === "png" && cfg.stego.enabled) {
    final = await embedInPng(blob, buildStegoPayload(cfg.stego));
  }
  dl(final, `${safeName}.${format}`);
}
