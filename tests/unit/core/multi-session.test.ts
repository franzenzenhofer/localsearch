/**
 * MULTI-SESSION TESTS - Comprehensive test coverage (Under 75 lines)
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MultiSessionManager } from "../../../src/core/MultiSessionManager";

describe("MultiSessionManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Session Creation", () => {
    it("should create new session with unique ID", () => {
      const sessionId = MultiSessionManager.createSession();
      expect(sessionId).toBeDefined();
      expect(sessionId.length).toBe(36); // UUID format
    });

    it("should store session in localStorage", () => {
      const sessionId = MultiSessionManager.createSession();
      const sessions = MultiSessionManager.getSessions();
      expect(sessions.length).toBe(1);
      expect(sessions[0].sessionId).toBe(sessionId);
    });

    it("should limit sessions to MAX_SESSIONS", () => {
      for (let i = 0; i < 15; i++) {
        MultiSessionManager.createSession();
      }
      const sessions = MultiSessionManager.getSessions();
      expect(sessions.length).toBe(10); // MAX_SESSIONS
    });
  });

  describe("File Management", () => {
    it("should add files to existing session", () => {
      const sessionId = MultiSessionManager.createSession();
      const files = [
        { name: "test1.txt", size: 100, path: "/test1.txt", type: "text/plain", content: "test1" },
        { name: "test2.txt", size: 200, path: "/test2.txt", type: "text/plain", content: "test2" }
      ];

      MultiSessionManager.addFilesToSession(sessionId, files);
      const sessions = MultiSessionManager.getSessions();
      expect(sessions[0].files.length).toBe(2);
      expect(sessions[0].fileCount).toBe(2);
    });

    it("should merge multiple sessions", () => {
      const session1 = MultiSessionManager.createSession();
      const session2 = MultiSessionManager.createSession();

      MultiSessionManager.addFilesToSession(session1, [
        { name: "file1.txt", size: 100, path: "/file1.txt", type: "text/plain", content: "file1" }
      ]);

      MultiSessionManager.addFilesToSession(session2, [
        { name: "file2.txt", size: 200, path: "/file2.txt", type: "text/plain", content: "file2" }
      ]);

      const merged = MultiSessionManager.mergeSessions([session1, session2]);
      expect(merged.fileCount).toBe(2);
      expect(merged.metadata.length).toBe(2);
      expect(merged.name).toContain("2 files");
    });
  });

  describe("Session Cleanup", () => {
    it("should clear all sessions", () => {
      MultiSessionManager.createSession();
      MultiSessionManager.clearSessions();
      expect(MultiSessionManager.getSessions().length).toBe(0);
    });
  });
});