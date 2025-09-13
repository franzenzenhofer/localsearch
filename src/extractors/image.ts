import { BaseExtractor } from "./base";
import { extractImageMetadata } from "./image/metadata";
import { performOCR } from "./image/ocr";
import { extractSVGText } from "./image/svg";
import { formatImageContent } from "./image/formatter";

export class ImageExtractor extends BaseExtractor {
  static supportedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
    ".svg",
    ".ico",
  ];

  async extract(file: File): Promise<string> {
    const extension = this.getFileExtension(file.name);
    const path = (file as any).webkitRelativePath || file.name;

    try {
      let content = "";
      const metadata = await extractImageMetadata(file);

      if (extension !== ".svg") {
        content = await performOCR(file);
      } else {
        const text = await file.text();
        content = extractSVGText(text);
      }

      return formatImageContent(path, file, metadata, content);
    } catch (error) {
      return formatImageContent(
        path,
        file,
        {},
        "Image content could not be extracted",
      );
    }
  }
}
