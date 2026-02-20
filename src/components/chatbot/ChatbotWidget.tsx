"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatbotWidget.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SESSION_STORAGE_KEY = "habib-chat-session-id";
const MAX_MESSAGES = 20;

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I’m here to help with Habib’s portfolio and services.",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    const nextSessionId = storedSession || createSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    setSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages, isOpen]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading && sessionId.length > 0,
    [input, isLoading, sessionId],
  );

  const sendMessage = async () => {
    const userText = input.trim();

    if (!userText || !sessionId || isLoading) {
      return;
    }

    const nextMessages: Message[] = [
      ...messages,
      { role: "user" as const, content: userText },
    ].slice(-MAX_MESSAGES);

    setInput("");
    setIsLoading(true);
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          sessionId,
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to fetch assistant response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (!chunk) {
          continue;
        }

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const last = updated[lastIndex];

          if (!last || last.role !== "assistant") {
            updated.push({ role: "assistant", content: chunk });
            return updated.slice(-MAX_MESSAGES);
          }

          updated[lastIndex] = {
            ...last,
            content: `${last.content}${chunk}`,
          };

          return updated.slice(-MAX_MESSAGES);
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while contacting the assistant.";

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (updated[lastIndex]?.role === "assistant" && !updated[lastIndex]?.content) {
          updated[lastIndex] = {
            role: "assistant",
            content: `Sorry, I could not respond: ${message}`,
          };
          return updated.slice(-MAX_MESSAGES);
        }

        updated.push({
          role: "assistant",
          content: `Sorry, I could not respond: ${message}`,
        });

        return updated.slice(-MAX_MESSAGES);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isOpen ? (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.title}>Habib Assistant</span>
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div className={styles.messages} ref={containerRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.message} ${
                  message.role === "user" ? styles.user : styles.assistant
                }`}
              >
                {message.content || (isLoading ? "…" : "")}
              </div>
            ))}
          </div>

          <div className={styles.disclaimer}>This assistant may make mistakes.</div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask about services, projects, or process..."
            />
            <button
              className={styles.sendButton}
              type="button"
              onClick={() => void sendMessage()}
              disabled={!canSend}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsOpen(true)}
        >
          Chat with Habib
        </button>
      )}
    </div>
  );
}
