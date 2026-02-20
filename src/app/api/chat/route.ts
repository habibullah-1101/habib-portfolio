import { NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = {
  messages: ChatMessage[];
  sessionId: string;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitStore: Map<string, RateEntry> =
  (globalThis as { __chatRateLimitStore?: Map<string, RateEntry> })
    .__chatRateLimitStore ??
  new Map<string, RateEntry>();

(globalThis as { __chatRateLimitStore?: Map<string, RateEntry> }).__chatRateLimitStore =
  rateLimitStore;

function getClientKey(request: NextRequest, sessionId: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown-ip";
  return `${sessionId}:${ip}`;
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  let body: ChatPayload;

  try {
    body = (await request.json()) as ChatPayload;
  } catch {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const safeMessages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message): message is ChatMessage =>
            Boolean(message) &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string" &&
            message.content.trim().length > 0,
        )
        .slice(-20)
    : [];

  if (!body.sessionId || typeof body.sessionId !== "string") {
    return new Response("sessionId is required", { status: 400 });
  }

  if (safeMessages.length === 0) {
    return new Response("messages are required", { status: 400 });
  }

  const clientKey = getClientKey(request, body.sessionId);

  if (isRateLimited(clientKey)) {
    return new Response("Rate limit exceeded. Please wait a minute.", {
      status: 429,
    });
  }

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are Habib Studio Portfolio Assistant. Help visitors understand Habib's portfolio, services, process, and ways to get in touch. Be concise, friendly, and avoid making up facts.",
        },
        ...safeMessages,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errorText = await upstream.text();
    return new Response(errorText || "Upstream request failed", {
      status: upstream.status || 500,
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed.startsWith("data:")) {
              continue;
            }

            const payload = trimmed.replace(/^data:\s*/, "");

            if (payload === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // Ignore malformed stream lines.
            }
          }
        }
      } catch {
        controller.error(new Error("Streaming error"));
      } finally {
        reader.releaseLock();
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
