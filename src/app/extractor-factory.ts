import { TextExtractor } from '../extractors/text.js';
import { PDFExtractor } from '../extractors/pdf.js';
import { DOCXExtractor } from '../extractors/docx.js';
import { CSVExtractor } from '../extractors/csv.js';
import type { TextExtractor as ITextExtractor } from '../extractors/base.js';

export function createExtractors(): Map<string, ITextExtractor> {
  return new Map([
    ['txt', new TextExtractor()],
    ['md', new TextExtractor()],
    ['html', new TextExtractor()],
    ['pdf', new PDFExtractor()],
    ['docx', new DOCXExtractor()],
    ['csv', new CSVExtractor()],
  ]);
}