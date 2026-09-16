"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string | Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | undefined;
  activeMode: "chat" | "work";
  setActiveMode: (mode: "chat" | "work") => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  createNewSession: () => void;
  selectSession: (id: string) => void;
  togglePinSession: (id: string, e?: React.MouseEvent) => void;
  deleteSession: (id: string, e?: React.MouseEvent) => void;
  saveOrUpdateSession: (
    sessionId: string | null,
    messages: ChatMessage[],
    customTitle?: string
  ) => string;
}

const STORAGE_KEY_SESSIONS = "agent_ai_chat_sessions_v1";
const STORAGE_KEY_ACTIVE = "agent_ai_active_session_id_v1";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<"chat" | "work">("chat");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted sessions on initial client mount
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE);

      if (storedSessions) {
        const parsed: ChatSession[] = JSON.parse(storedSessions);
        // Ensure sessions is an array without any static dummy items
        if (Array.isArray(parsed)) {
          setSessions(parsed);
        }
      }

      if (storedActiveId) {
        setActiveSessionId(storedActiveId);
      }
    } catch (err) {
      console.error("Failed to load chat sessions from localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage whenever sessions change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (err) {
      console.error("Failed to save sessions to localStorage:", err);
    }
  }, [sessions, isLoaded]);

  // Sync activeSessionId to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (activeSessionId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeSessionId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch (err) {
      console.error("Failed to save active session id:", err);
    }
  }, [activeSessionId, isLoaded]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // + Obrolan baru: clears active session screen and opens a clean new conversation
  const createNewSession = useCallback(() => {
    setActiveSessionId(null);
    setActiveMode("chat");
    setIsMobileSidebarOpen(false);
  }, []);

  const selectSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setActiveMode("chat");
    setIsMobileSidebarOpen(false);
  }, []);

  const togglePinSession = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  }, []);

  const deleteSession = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
      }
    },
    [activeSessionId]
  );

  // Creates a new session if sessionId is null or not found, or updates existing session
  const saveOrUpdateSession = useCallback(
    (
      sessionId: string | null,
      messages: ChatMessage[],
      customTitle?: string
    ): string => {
      if (messages.length === 0) return sessionId || "";

      // Derive auto title from first user message if not explicitly provided
      const firstUserMsg = messages.find((m) => m.role === "user")?.content || "Obrolan Pasar";
      const cleanTitle =
        customTitle ||
        (firstUserMsg.length > 36 ? firstUserMsg.slice(0, 36) + "..." : firstUserMsg);

      let targetId = sessionId;

      setSessions((prev) => {
        const existingIndex = prev.findIndex((s) => s.id === targetId);

        if (existingIndex >= 0 && targetId) {
          // Update existing
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            messages,
            updatedAt: Date.now(),
            title: updated[existingIndex].title || cleanTitle,
          };
          return updated;
        } else {
          // Create new session
          const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          targetId = newId;
          const newSession: ChatSession = {
            id: newId,
            title: cleanTitle,
            messages,
            isPinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          return [newSession, ...prev];
        }
      });

      if (targetId && targetId !== activeSessionId) {
        setActiveSessionId(targetId);
      }

      return targetId || "";
    },
    [activeSessionId]
  );

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        activeMode,
        setActiveMode,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        createNewSession,
        selectSession,
        togglePinSession,
        deleteSession,
        saveOrUpdateSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
