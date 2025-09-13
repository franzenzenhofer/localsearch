/**
 * OCR MAIN - Simplified Entry Point (Under 75 lines)
 */

import { processOCRImage } from "./ocr-processor";

export async function performOCR(file: File): Promise<string> {
  return processOCRImage(file);
}
