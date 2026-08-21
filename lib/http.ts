export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers: { "cache-control": "no-store", ...headers } });
}

export function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return json({ error: message }, message.startsWith("Missing required") ? 503 : 500);
}

export async function body<T>(request: Request): Promise<T> {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/json")) throw new Error("Content-Type must be application/json");
  return request.json() as Promise<T>;
}
