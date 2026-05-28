// Safe metadata steganography: embed JSON inside PNG tEXt chunks or SVG <metadata>.
import extract from "png-chunks-extract";
import encode from "png-chunks-encode";
import text from "png-chunk-text";
import type { StegoConfig } from "./types";

const KEYWORD = "lanq";

export function buildStegoPayload(s: StegoConfig) {
  return JSON.stringify({
    app: "LanQ",
    v: "1.0.2",
    author: s.author || undefined,
    message: s.message || undefined,
    campaign: s.campaign || undefined,
    t: new Date().toISOString(),
  });
}

/** Embed metadata in a PNG ArrayBuffer/Blob — returns a new Blob. */
export async function embedInPng(blob: Blob, payload: string): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const chunks = extract(buf);
  const idatIdx = chunks.findIndex((c) => c.name === "IDAT");
  const chunk = text.encode(KEYWORD, payload);
  chunks.splice(idatIdx, 0, chunk);
  const out = encode(chunks);
  return new Blob([out.slice().buffer], { type: "image/png" });
}

export function readFromPng(buffer: ArrayBuffer): string | null {
  const chunks = extract(new Uint8Array(buffer));
  for (const c of chunks) {
    if (c.name === "tEXt") {
      const { keyword, text: value } = text.decode(c.data);
      if (keyword === KEYWORD) return value;
    }
  }
  return null;
}

/** Embed metadata in an SVG string. */
export function embedInSvg(svg: string, payload: string): string {
  const escaped = payload.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const meta = `<metadata id="lanq-meta"><![CDATA[${escaped}]]></metadata>`;
  return svg.replace(/<svg([^>]*)>/, `<svg$1>${meta}`);
}
