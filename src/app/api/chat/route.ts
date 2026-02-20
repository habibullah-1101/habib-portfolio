import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: messages.map((message) => ({
          role: message.role,
          content: [{ type: "input_text", text: message.content }],
        })),
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text();
      return NextResponse.json({ error: detail || "Failed to reach OpenAI" }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = upstream.body!.getReader();
        let buffered = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffered += decoder.decode(value, { stream: true });
          const lines = buffered.split("\n");
          buffered = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const event = JSON.parse(payload) as {
                type?: string;
                delta?: string;
              };

              if (event.type === "response.output_text.delta" && event.delta) {
                controller.enqueue(encoder.encode(event.delta));
              }
            } catch {
              // Skip malformed server-sent event payloads.
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
