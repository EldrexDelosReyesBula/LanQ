import QRCode from 'qrcode';
import { QRCodeErrorCorrectionLevel, QRModule } from '../types';

/**
 * Generates the QR Code matrix data
 */
export const generateQRData = async (
  text: string,
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
): Promise<{ modules: boolean[][]; size: number }> => {
  try {
    const rawData = await QRCode.create(text, {
      errorCorrectionLevel: errorCorrectionLevel,
    });

    const modules = rawData.modules.data;
    const size = rawData.modules.size;
    const matrix: boolean[][] = [];

    // Convert flat Uint8Array to 2D boolean array
    for (let y = 0; y < size; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < size; x++) {
        row.push(!!modules[y * size + x]);
      }
      matrix.push(row);
    }

    return { modules: matrix, size };
  } catch (err) {
    console.error("QR Generation Error", err);
    throw err;
  }
};

/**
 * Determines if a coordinate is part of a finder pattern (the 3 big squares)
 */
export const isFinderPattern = (x: number, y: number, size: number): boolean => {
  // Top Left
  if (x < 7 && y < 7) return true;
  // Top Right
  if (x >= size - 7 && y < 7) return true;
  // Bottom Left
  if (x < 7 && y >= size - 7) return true;
  return false;
};
