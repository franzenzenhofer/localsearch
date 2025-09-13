/**
 * OCR PROCESSOR - Main Processing Logic (Under 75 lines)
 */

import {
  validateOCRFile,
  validateImageDimensions,
  analyzeImageContent,
} from "./ocr-validation";

export async function processOCRImage(file: File): Promise<string> {
  // Validate file first
  const validationError = validateOCRFile(file);
  if (validationError) return validationError;

  try {
    const img = new window.Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // EDGE CASE 4: Canvas not supported
    if (!ctx) {
      return "Canvas not supported in this browser - cannot perform OCR";
    }

    const imageUrl = URL.createObjectURL(file);

    return new Promise((resolve) => {
      // EDGE CASE 5: Image load timeout after 30 seconds
      const timeout = window.setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
        resolve(
          "Image processing timeout - OCR could not complete within 30 seconds",
        );
      }, 30000);

      img.onload = () => {
        try {
          window.clearTimeout(timeout);

          const dimensionError = validateImageDimensions(img);
          if (dimensionError) {
            URL.revokeObjectURL(imageUrl);
            resolve(dimensionError);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // EDGE CASE 8: Analyze image for text content potential
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasContent = analyzeImageContent(imageData);

          URL.revokeObjectURL(imageUrl);

          if (!hasContent) {
            resolve(
              "Image appears to contain no text content - solid color or blank image detected",
            );
          } else {
            resolve(
              "OCR processing completed - text extraction functionality ready for implementation",
            );
          }
        } catch (err) {
          window.clearTimeout(timeout);
          URL.revokeObjectURL(imageUrl);
          resolve("Image processing error - " + (err as Error).message);
        }
      };

      img.onerror = () => {
        window.clearTimeout(timeout);
        URL.revokeObjectURL(imageUrl);
        resolve(
          "Failed to load image - file may be corrupted or unsupported format",
        );
      };

      // EDGE CASE 9: Handle different image formats safely
      try {
        img.src = imageUrl;
      } catch {
        window.clearTimeout(timeout);
        URL.revokeObjectURL(imageUrl);
        resolve("Cannot load image source - invalid file format");
      }
    });
  } catch (error) {
    return "OCR initialization failed - " + (error as Error).message;
  }
}
