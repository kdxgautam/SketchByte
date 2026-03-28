import { NextRequest } from "next/server";
import Constants from "@/data/Constants";

export async function POST(req: NextRequest) {
  const { model, description, imageUrl } = await req.json();

  // Find the corresponding model
  const ModelObj = Constants.AiModelList.find((item) => item.name == model);
  console.log(ModelObj);
  const modelName = ModelObj?.modelName;
  console.log(modelName);

  // Fetch OpenRouter API with streaming enabled
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName ?? "google/gemini-2.0-pro-exp-02-05:free",
      stream: true,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: description },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  // Create a readable stream to send data in real-time
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let sseBuffer = "";

      if (!reader) {
        controller.close();
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Keep a rolling buffer because SSE lines can be split across network chunks.
          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split("\n");
          sseBuffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            if (jsonStr === "[DONE]") continue;

            try {
              const json = JSON.parse(jsonStr);
              const text = json.choices?.[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (error) {
              console.error("JSON Parse Error:", error, jsonStr);
            }
          }
        }

        // Flush any final line left in the buffer.
        const tail = sseBuffer.trim();
        if (tail.startsWith("data: ")) {
          const jsonStr = tail.slice(6).trim();
          if (jsonStr && jsonStr !== "[DONE]") {
            try {
              const json = JSON.parse(jsonStr);
              const text = json.choices?.[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (error) {
              console.error("JSON Parse Error:", error, jsonStr);
            }
          }
        }
      } catch (error) {
        console.error("Streaming Error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
