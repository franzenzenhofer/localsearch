/**
 * OCR VALIDATION - Edge Case Handlers (Under 75 lines)
 */

export function validateOCRFile(file: File): string | null {
  // EDGE CASE 1: Validate file exists and has content
  if (!file || file.size === 0) {
    return "Empty or invalid image file - no text content available";
  }

  // EDGE CASE 2: Check file type is actually an image
  if (!file.type.startsWith("image/")) {
    return "File is not a valid image format - no text extraction possible";
  }

  // EDGE CASE 3: Handle very large images that could crash browser
  if (file.size > 50 * 1024 * 1024) {
    // 50MB limit
    return "Image file too large for OCR processing - file size exceeds 50MB limit";
  }

  return null; // Valid file
}

export function validateImageDimensions(img: HTMLImageElement): string | null {
  // EDGE CASE 6: Handle corrupted images with 0 dimensions
  if (img.width === 0 || img.height === 0) {
    return "Image has invalid dimensions - cannot extract text";
  }

  // EDGE CASE 7: Handle extremely large images that could crash
  if (img.width > 10000 || img.height > 10000) {
    return "Image dimensions too large for OCR processing - max 10000x10000 pixels";
  }

  return null; // Valid dimensions
}

// Helper function to analyze if image has text content potential
export function analyzeImageContent(imageData: ImageData): boolean {
  const data = imageData.data;
  let colorVariance = 0;
  let pixelCount = 0;

  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate basic color variance
    colorVariance += Math.abs(r - 128) + Math.abs(g - 128) + Math.abs(b - 128);
    pixelCount++;
  }

  // If image has sufficient color variance, likely contains content
  const avgVariance = colorVariance / pixelCount;
  return avgVariance > 20; // Threshold for content detection
}
