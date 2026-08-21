/* eslint-disable @typescript-eslint/no-explicit-any */
import { required } from "./env";

export type AIInput = { modelId: string; prompt: string; systemPrompt?: string };

export async function generate(input: AIInput) {
  if (input.modelId.startsWith("gpt")) return openai(input);
  if (input.modelId.startsWith("claude")) return anthropic(input);
  if (input.modelId.startsWith("gemini")) return gemini(input);
  throw new Error("Unsupported model");
}

async function openai(input: AIInput) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST", headers: { authorization: `Bearer ${required("OPENAI_API_KEY")}`, "content-type": "application/json" },
    body: JSON.stringify({ model: input.modelId, input: input.prompt, instructions: input.systemPrompt, store: false }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || "OpenAI request failed");
  const text = data.output_text || data.output?.flatMap((o: any) => o.content || []).find((c: any) => c.type === "output_text")?.text || "";
  return { text, usage: data.usage || {}, provider: "openai" };
}

async function anthropic(input: AIInput) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "x-api-key": required("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: input.modelId, max_tokens: 2048, system: input.systemPrompt, messages: [{ role: "user", content: input.prompt }] }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || "Anthropic request failed");
  return { text: data.content?.find((x: any) => x.type === "text")?.text || "", usage: data.usage || {}, provider: "anthropic" };
}

async function gemini(input: AIInput) {
  const key = required("GOOGLE_AI_API_KEY");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(input.modelId)}:generateContent?key=${key}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ systemInstruction: input.systemPrompt ? { parts: [{ text: input.systemPrompt }] } : undefined, contents: [{ role: "user", parts: [{ text: input.prompt }] }] }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || "Gemini request failed");
  return { text: data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") || "", usage: data.usageMetadata || {}, provider: "google" };
}
