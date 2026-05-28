import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { configToOptions } from "@/features/generator/buildQR";
import type { QRConfig } from "@/features/generator/types";

export function QRCanvas({
  config,
  size,
  className,
}: {
  config: QRConfig;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const opts = configToOptions(config, size);
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts);
      if (ref.current) {
        ref.current.innerHTML = "";
        qrRef.current.append(ref.current);
      }
    } else {
      qrRef.current.update(opts);
    }
  }, [config, size]);

  return <div ref={ref} className={className} aria-label="QR code" />;
}
