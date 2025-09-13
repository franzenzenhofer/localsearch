import { useCallback } from "react";
import { SearchFacade } from "../core/SearchFacade";
import { DebugLogger } from "../utils/DebugLogger";
import { createFileUploadAction } from "./FileUploadAction";

export function createSearchActions(
  facade: SearchFacade,
  state: any,
  setters: any,
) {
  const logger = DebugLogger.getInstance();

  const performSearch = useCallback(async () => {
    logger.event("SEARCH", "Search initiated", {
      query: state.query,
      fileCount: state.fileCount,
    });

    if (!state.query.trim() || state.fileCount === 0) {
      logger.warn("SEARCH", "Search skipped - empty query or no files", {
        query: state.query,
        fileCount: state.fileCount,
      });
      return;
    }

    logger.info(
      "SEARCH",
      `Performing search for: "${state.query}" across ${state.fileCount} files`,
    );
    setters.setIsSearching(true);

    try {
      logger.info("SEARCH", "Executing search query via facade");
      const searchResults = facade.search(state.query);
      setters.setResults(searchResults);
      logger.success(
        "SEARCH",
        `Search completed: ${searchResults.length} results found`,
        {
          query: state.query,
          resultCount: searchResults.length,
          results: searchResults.slice(0, 3), // Log first 3 results for debugging
        },
      );
    } catch (error) {
      logger.error("SEARCH", "Search failed with error", {
        error,
        query: state.query,
      });
      setters.setResults([]);
    } finally {
      setters.setIsSearching(false);
      logger.info("SEARCH", "Search operation completed");
    }
  }, [state.query, state.fileCount, facade, setters, logger]);

  const handleFileUpload = createFileUploadAction(facade, state, setters);

  return { performSearch, handleFileUpload };
}
