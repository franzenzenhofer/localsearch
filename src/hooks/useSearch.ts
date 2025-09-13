import { useState, useCallback } from "react";
import { SearchFacade } from "../core/SearchFacade";
import { useSearchState } from "./SearchState";
import { createSearchActions } from "./SearchActions";
import { DebugLogger } from "../utils/DebugLogger";

export function useSearch() {
  const state = useSearchState();
  const logger = DebugLogger.getInstance();

  // Initialize debug logging
  logger.info("HOOK", "useSearch hook initialized");

  const [searchFacade] = useState(() => {
    logger.info("FACADE", "Creating new SearchFacade instance");
    return new SearchFacade({
      onProgress: (current, total) => {
        logger.info("PROGRESS", `File progress: ${current}/${total}`, {
          current,
          total,
        });
        state.setProgress({ current, total });
        state.setProcessingStatus((prev) => ({
          ...prev,
          processedFiles: current,
          totalFiles: total,
          progress: total > 0 ? Math.round((current / total) * 100) : 0,
        }));
      },
      onError: (error) => {
        logger.error("ERROR", "Processing error occurred", {
          error,
          timestamp: Date.now(),
        });
        state.setProcessingStatus((prev) => ({
          ...prev,
          errors: [...prev.errors, error],
          stage: "error",
        }));
      },
      onStageChange: (stage) => {
        logger.info("STAGE", `Processing stage changed to: ${stage}`, {
          stage,
          timestamp: Date.now(),
        });
        state.setProcessingStatus((prev) => ({ ...prev, stage: stage as any }));
      },
      onFileProcessing: (filename) => {
        logger.info("FILE", `Processing file: ${filename}`, {
          filename,
          timestamp: Date.now(),
        });
        state.setProcessingStatus((prev) => ({
          ...prev,
          currentFile: filename,
        }));
      },
      onLog: (message) => {
        logger.info("LOG", message);
        state.setProcessingStatus((prev) => ({
          ...prev,
          logs: [...prev.logs.slice(-20), message],
        }));
      },
    });
  });

  const actions = createSearchActions(searchFacade, state, state);

  const closeStatusModal = useCallback(() => {
    logger.event("UI", "Status modal closed", { timestamp: Date.now() });
    state.setShowStatus(false);
  }, [state, logger]);

  return {
    query: state.query,
    setQuery: state.setQuery,
    results: state.results,
    isSearching: state.isSearching,
    fileCount: state.fileCount,
    progress: state.progress,
    processingStatus: state.processingStatus,
    showStatus: state.showStatus,
    performSearch: actions.performSearch,
    handleFileUpload: actions.handleFileUpload,
    closeStatusModal,
    searchFacade,
  };
}
