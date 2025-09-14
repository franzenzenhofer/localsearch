/**
 * MULTI-SESSION MANAGER - Handles file uploads across multiple sessions
 * Under 75 lines - DRY & KISS compliant
 */

import { StorageManager, StoredIndex } from "./StorageManager";
import type { FileMetadata } from "./types";

export interface SessionData {
  sessionId: string;
  timestamp: number;
  fileCount: number;
  files: FileMetadata[];
}

export class MultiSessionManager {
  private static readonly SESSION_KEY = "localsearch_sessions";
  private static readonly MAX_SESSIONS = 10;

  static createSession(): string {
    const sessionId = crypto.randomUUID();
    const sessions = this.getSessions();

    sessions.push({
      sessionId,
      timestamp: Date.now(),
      fileCount: 0,
      files: []
    });

    // Keep only recent sessions
    if (sessions.length > this.MAX_SESSIONS) {
      sessions.shift();
    }

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
    return sessionId;
  }

  static addFilesToSession(sessionId: string, files: FileMetadata[]): void {
    const sessions = this.getSessions();
    const session = sessions.find(s => s.sessionId === sessionId);

    if (session) {
      session.files.push(...files);
      session.fileCount = session.files.length;
      session.timestamp = Date.now();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
    }
  }

  static mergeSessions(sessionIds: string[]): StoredIndex {
    const sessions = this.getSessions();
    const mergedFiles: FileMetadata[] = [];

    sessionIds.forEach(id => {
      const session = sessions.find(s => s.sessionId === id);
      if (session) {
        mergedFiles.push(...session.files);
      }
    });

    return {
      id: crypto.randomUUID(),
      name: `Merged Sessions (${mergedFiles.length} files)`,
      created: Date.now(),
      fileCount: mergedFiles.length,
      metadata: mergedFiles,
      searchData: null
    };
  }

  static getSessions(): SessionData[] {
    const stored = localStorage.getItem(this.SESSION_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static clearSessions(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}