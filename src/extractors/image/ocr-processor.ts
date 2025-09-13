/**
 * OCR PROCESSOR - REAL TESSERACT.JS OCR (Under 75 lines)
 */

import Tesseract from 'tesseract.js';
import { validateOCRFile, validateImageDimensions } from "./ocr-validation";

export async function processOCRImage(file: File): Promise<string> {
  const validationError = validateOCRFile(file);
  if (validationError) return validationError;

  try {
    const img = new window.Image();
    const imageUrl = URL.createObjectURL(file);

    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
        resolve("OCR timeout after 30 seconds");
      }, 30000);

      img.onload = async () => {
        try {
          window.clearTimeout(timeout);

          const dimensionError = validateImageDimensions(img);
          if (dimensionError) {
            URL.revokeObjectURL(imageUrl);
            resolve(dimensionError);
            return;
          }

          // REAL OCR WITH TESSERACT.JS
          console.log(`🔍 OCR: Starting text extraction for ${file.name} (${file.size} bytes)`);
          const result = await Tesseract.recognize(file, 'eng', {
            logger: (m) => console.log(`🔍 OCR Progress: ${m.status} ${m.progress ? Math.round(m.progress * 100) + '%' : ''}`)
          });

          URL.revokeObjectURL(imageUrl);

          const extractedText = result.data.text.trim();
          
          console.log(`🔍 OCR: Extracted ${extractedText.length} characters from ${file.name}`);
          console.log(`🔍 OCR: Text preview: "${extractedText.substring(0, 100)}${extractedText.length > 100 ? '...' : ''}"`);
          
          if (extractedText.length === 0) {
            console.log(`⚠️ OCR: No text found in ${file.name}`);
            resolve("No text found in image");
          } else {
            console.log(`✅ OCR: Successfully extracted text from ${file.name}`);
            resolve(extractedText);
          }

        } catch (err) {
          window.clearTimeout(timeout);
          URL.revokeObjectURL(imageUrl);
          resolve("OCR processing error: " + (err as Error).message);
        }
      };

      img.onerror = () => {
        window.clearTimeout(timeout);
        URL.revokeObjectURL(imageUrl);
        resolve("Failed to load image for OCR");
      };

      try {
        img.src = imageUrl;
      } catch {
        window.clearTimeout(timeout);
        URL.revokeObjectURL(imageUrl);
        resolve("Cannot load image source for OCR");
      }
    });
  } catch (error) {
    return "OCR initialization failed: " + (error as Error).message;
  }
}
