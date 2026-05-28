import { useEffect, useRef } from "react";
import QRCodeStyling, { type Options } from "qr-code-styling";
import type { Palette } from "@/features/autoBlend/palettes";

type Props = {
  data: string;
  palette: Palette;
  size?: number;
  className?: string;
  corner?: number;
  dot?: number;
};

export function QRPreview({ data, palette, size = 360, className, corner, dot }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    let dotsType: any = "rounded";
    if (dot !== undefined) {
      if (dot < 20) dotsType = "dots";
      else if (dot < 40) dotsType = "square";
      else if (dot < 65) dotsType = "rounded";
      else if (dot < 85) dotsType = "classy";
      else dotsType = "extra-rounded";
    }

    let cornersSquareType: any = "extra-rounded";
    if (corner !== undefined) {
      if (corner < 25) cornersSquareType = "square";
      else if (corner < 70) cornersSquareType = "dot";
      else cornersSquareType = "extra-rounded";
    }

    const dotsOptions: any = {
      type: dotsType,
    };

    if (palette.fillType === "solid") {
      dotsOptions.color = palette.colors[0];
    } else {
      dotsOptions.gradient = {
        type: palette.fillType === "radial" ? "radial" : "linear",
        rotation: palette.fillType === "radial" ? undefined : Math.PI / 4,
        colorStops: [
          { offset: 0, color: palette.colors[0] },
          { offset: 0.5, color: palette.colors[1] },
          { offset: 1, color: palette.colors[2] },
        ],
      };
    }

    const options: Options = {
      width: size,
      height: size,
      type: "svg",
      data: data || (typeof window !== "undefined" ? window.location.origin : "https://lanq.studio"),
      margin: 8,
      qrOptions: { errorCorrectionLevel: "H" },
      backgroundOptions: { color: palette.background },
      dotsOptions,
      cornersSquareOptions: { type: cornersSquareType, color: palette.colors[0] },
      cornersDotOptions: { type: "dot", color: palette.colors[2] },
    };

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      if (ref.current) {
        ref.current.innerHTML = "";
        qrRef.current.append(ref.current);
      }
    } else {
      qrRef.current.update(options);
    }
  }, [data, palette, size, corner, dot]);

  return <div ref={ref} className={className} aria-label="QR code preview" />;
}

export async function downloadQR(
  data: string,
  palette: Palette,
  ext: "png" | "svg",
  corner?: number,
  dot?: number,
) {
  let dotsType: any = "rounded";
  if (dot !== undefined) {
    if (dot < 20) dotsType = "dots";
    else if (dot < 40) dotsType = "square";
    else if (dot < 65) dotsType = "rounded";
    else if (dot < 85) dotsType = "classy";
    else dotsType = "extra-rounded";
  }

  let cornersSquareType: any = "extra-rounded";
  if (corner !== undefined) {
    if (corner < 25) cornersSquareType = "square";
    else if (corner < 70) cornersSquareType = "dot";
    else cornersSquareType = "extra-rounded";
  }

  const downloadDotsOptions: any = {
    type: dotsType,
  };

  if (palette.fillType === "solid") {
    downloadDotsOptions.color = palette.colors[0];
  } else {
    downloadDotsOptions.gradient = {
      type: palette.fillType === "radial" ? "radial" : "linear",
      rotation: palette.fillType === "radial" ? undefined : Math.PI / 4,
      colorStops: [
        { offset: 0, color: palette.colors[0] },
        { offset: 0.5, color: palette.colors[1] },
        { offset: 1, color: palette.colors[2] },
      ],
    };
  }

  const qr = new QRCodeStyling({
    width: 1024,
    height: 1024,
    type: "svg",
    data: data || (typeof window !== "undefined" ? window.location.origin : "https://lanq.studio"),
    margin: 24,
    qrOptions: { errorCorrectionLevel: "H" },
    backgroundOptions: { color: palette.background },
    dotsOptions: downloadDotsOptions,
    cornersSquareOptions: { type: cornersSquareType, color: palette.colors[0] },
    cornersDotOptions: { type: "dot", color: palette.colors[2] },
  });
  await qr.download({ name: `lanq-${palette.id}`, extension: ext });
}
