import { useEffect } from "react";
import { DebugLogger } from "../utils/DebugLogger";

export function useAppInit() {
  const logger = DebugLogger.getInstance();

  useEffect(() => {
    logger.info("APP", "FileSearch application initialized");
    logger.info("APP", "Version info", {
      version: "1.65.0",
      buildTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }, [logger]);

  return logger;
}
