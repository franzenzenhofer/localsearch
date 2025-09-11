export interface FileMetadata {
  id: string;
  path: string;
  name: string;
  extension: string;
  size: number;
  lastModified: number;
  type: FileTypeValue;
  language?: string;
  hash: string;
}

export interface DocumentContent {
  id: string;
  fileId: string;
  text: string;
  metadata: Record<string, unknown>;
}

export const FileType = {
  PDF: 'pdf',
  DOCX: 'docx',
  TXT: 'txt',
  MD: 'md',
  CSV: 'csv',
  HTML: 'html',
  UNKNOWN: 'unknown',
} as const;

export type FileTypeValue = typeof FileType[keyof typeof FileType];