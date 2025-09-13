// Shared FileDetails interface for the application
export interface FileDetails {
  id: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string;
  metadata?: any;
}
