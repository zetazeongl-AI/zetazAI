/* eslint-disable @typescript-eslint/no-explicit-any */
import { generate } from "../../../../lib/ai";
import { requireUser } from "../../../../lib/auth";
import { db } from "../../../../lib/supabase";
import { body } from "../../../../lib/http";

const ALLOWED = new Set(["gpt-5.2", "claude-sonnet-4-6", "gemini-3-pro"]);
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await body<{ modelId: string; prompt: string; conversationId?: string }>(request);
    if (!ALLOWED.has(input.modelId) || !input.prompt?.trim() || input.prompt.length > 20000) return Response.json({ error: "Invalid request" }, { status: 400 });
    const usageRows = await db(`usage_daily?user_id=eq.${user.id}&day=eq.${new Date().toISOString().slice(0,10)}&select=requests`) as any[];
    if ((usageRows?.[0]?.requests || 0) >= 100) return Response.json({ error: "Daily request limit reached" }, { status: 429 });
    const conversationId = input.conversationId || crypto.randomUUID();
    await db("messages", { method: "POST", body: JSON.stringify({ conversation_id: conversationId, user_id: user.id, role: "user", content: input.prompt, model_id: input.modelId }) });
    const result = await generate({ modelId: input.modelId, prompt: input.prompt, systemPrompt: "You are ZetaZAI by ZetaZeon, a secure and helpful multimodal workspace assistant." });
    await db("messages", { method: "POST", body: JSON.stringify({ conversation_id: conversationId, user_id: user.id, role: "assistant", content: result.text, model_id: input.modelId, metadata: result.usage }) });
    await db("usage_daily?on_conflict=user_id,day", { method: "POST", headers: { prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ user_id: user.id, day: new Date().toISOString().slice(0,10), requests: (usageRows?.[0]?.requests || 0) + 1 }) });
    return Response.json({ conversationId, message: result.text, provider: result.provider, usage: result.usage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return Response.json({ error: message === "UNAUTHORIZED" ? "Please sign in" : message }, { status: message === "UNAUTHORIZED" ? 401 : 503 });
  }
}
