import { useCallback } from "react";
import { SearchFacade } from "../core/SearchFacade";
import { DebugLogger } from "../utils/DebugLogger";

export function createFileUploadAction(
  facade: SearchFacade,
  state: any,
  setters: any,
) {
  const logger = DebugLogger.getInstance();

  return useCallback(
    async (files: File[]) => {
      logger.event("UPLOAD", "File upload initiated", {
        fileCount: files.length,
        fileNames: files.map((f) => f.name),
        fileSizes: files.map((f) => f.size),
        fileTypes: files.map((f) => f.type),
      });

      if (files.length === 0) {
        logger.warn("UPLOAD", "No files provided for upload");
        return;
      }

      logger.info("UPLOAD", `Starting file upload: ${files.length} files`);
      setters.setShowStatus(true);

      setters.setProcessingStatus({
        stage: "uploading",
        progress: 0,
        totalFiles: files.length,
        processedFiles: 0,
        errors: [],
        logs: [`Starting to process ${files.length} file(s)`],
      });

      try {
        logger.info("UPLOAD", "Starting facade.processFiles()", {
          fileCount: files.length,
        });
        await facade.processFiles(files);
        const newCount = facade.getDocumentCount();
        setters.setFileCount(newCount);

        logger.success(
          "UPLOAD",
          `File processing complete: ${newCount} files indexed`,
          {
            newCount,
            previousCount: state.fileCount || 0,
            processed: files.length,
          },
        );

        logger.info(
          "UI",
          "File processing complete - status modal will remain open for user review",
        );
      } catch (error) {
        logger.error("UPLOAD", "File indexing failed with critical error", {
          error,
          fileCount: files.length,
          fileNames: files.map((f) => f.name),
          errorMessage: error?.toString(),
        });
        setters.setProcessingStatus((prev: any) => ({
          ...prev,
          stage: "error",
          errors: [...prev.errors, `Processing failed: ${error}`],
        }));
      }
    },
    [facade, setters, state.fileCount, logger],
  );
}
