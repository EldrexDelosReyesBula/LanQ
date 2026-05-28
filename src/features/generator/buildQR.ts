import QRCodeStyling, { type Options } from "qr-code-styling";
import type { QRConfig, ColorFill } from "./types";

function fillToOptions(fill: ColorFill) {
  if (fill.mode === "solid") return { color: fill.color };
  return {
    gradient: {
      type: fill.gradientType,
      rotation: fill.rotation,
      colorStops: fill.stops,
    },
  };
}

export function configToOptions(cfg: QRConfig, sizeOverride?: number): Options {
  const size = sizeOverride ?? cfg.size;
  return {
    width: size,
    height: size,
    type: "svg",
    data: cfg.data || " ",
    margin: cfg.margin,
    qrOptions: { errorCorrectionLevel: cfg.ecLevel },
    backgroundOptions: { color: cfg.backgroundColor },
    dotsOptions: { type: cfg.dotsType, ...fillToOptions(cfg.dotsFill) },
    cornersSquareOptions: { type: cfg.cornersSquareType, color: cfg.cornersSquareColor },
    cornersDotOptions: { type: cfg.cornersDotType, color: cfg.cornersDotColor },
    image: cfg.logo || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: cfg.logoMargin,
      imageSize: cfg.logoSize,
      hideBackgroundDots: cfg.hideDotsBehindLogo,
    },
  };
}

export function makeQR(cfg: QRConfig, sizeOverride?: number) {
  return new QRCodeStyling(configToOptions(cfg, sizeOverride));
}
