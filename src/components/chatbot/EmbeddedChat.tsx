"use client";

import { CSSProperties, FormEvent, useMemo, useRef, useState } from "react";


type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const sectionStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "2rem 1rem",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "900px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.03)",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const messagesStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "1rem",
  minHeight: "320px",
  maxHeight: "500px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

const inputRowStyle: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
};

export function EmbeddedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const history = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            last.content = accumulated;
          }
          return next;
        });
      }

      requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content) {
          last.content = "Sorry, I could not generate a response right now.";
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="assistant" style={sectionStyle}>
      <div style={cardStyle}>
        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Chat with Habib</h2>
          <p style={{ opacity: 0.8 }}>Ask about projects, services, pricing, or process.</p>
        </div>

        <div ref={viewportRef} style={messagesStyle}>
          {messages.length === 0 && (
            <p style={{ opacity: 0.7 }}>Start the conversation by asking a question.</p>
          )}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              style={{
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                background:
                  message.role === "user"
                    ? "rgba(99, 102, 241, 0.25)"
                    : "rgba(255, 255, 255, 0.08)",
              }}
            >
              {message.content || (isLoading && message.role === "assistant" ? "Thinking..." : "")}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={inputRowStyle}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask anything about Habib's work..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(99, 102, 241, 0.25)",
              color: "inherit",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
        </form>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>This assistant may make mistakes.</p>
      </div>
    </section>
  );
}
