export function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function configured(...names: string[]) {
  return names.every((name) => Boolean(process.env[name]));
}

export const publicOrigin = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
