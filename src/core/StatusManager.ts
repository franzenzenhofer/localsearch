import type { ProcessingStatus } from "../types/processing";

export interface StatusCallbacks {
  onProgress?: (current: number, total: number) => void;
  onError?: (error: string) => void;
  onStageChange?: (stage: string) => void;
  onFileProcessing?: (filename: string) => void;
  onLog?: (message: string) => void;
}

const INITIAL_STATUS: ProcessingStatus = {
  stage: "idle",
  progress: 0,
  totalFiles: 0,
  processedFiles: 0,
  errors: [],
  logs: [],
};

export class StatusManager {
  private status: ProcessingStatus = { ...INITIAL_STATUS };

  constructor(private callbacks: StatusCallbacks = {}) {}

  initialize(totalFiles: number): void {
    this.status = {
      stage: "uploading",
      progress: 0,
      totalFiles,
      processedFiles: 0,
      errors: [],
      logs: [`Processing ${totalFiles} files`],
    };
    this.callbacks.onStageChange?.("uploading");
  }

  updateFile(filename: string, current: number, total: number): void {
    this.status.currentFile = filename;
    this.callbacks.onFileProcessing?.(filename);
    this.log(`Processing ${current}/${total}: ${filename}`);
  }

  increment(): void {
    this.status.processedFiles++;
    this.status.progress =
      (this.status.processedFiles / this.status.totalFiles) * 100;
    this.callbacks.onProgress?.(
      this.status.processedFiles,
      this.status.totalFiles,
    );
  }

  error(error: string): void {
    this.status.errors.push(error);
    this.log(`ERROR: ${error}`);
    this.callbacks.onError?.(error);
  }

  stage(stage: ProcessingStatus["stage"], msg?: string): void {
    this.status.stage = stage;
    this.callbacks.onStageChange?.(stage);
    this.log(msg || `Stage: ${stage}`);
  }

  complete(count: number): void {
    this.stage("complete", `Complete! ${count} files indexed`);
    this.callbacks.onProgress?.(this.status.totalFiles, this.status.totalFiles);
  }

  reset(): void {
    this.status = { ...INITIAL_STATUS };
  }
  getStatus(): ProcessingStatus {
    return { ...this.status };
  }

  log(message: string): void {
    console.log(`[SearchFacade] ${message}`);
    this.status.logs.push(message);
    this.callbacks.onLog?.(message);
  }
}
