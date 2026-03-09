import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  if (!session) return false;

  const secret = process.env.ADMIN_SESSION_SECRET || "default-secret";
  return session.value === Buffer.from(secret).toString("base64");
}

export function getSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "default-secret";
  return Buffer.from(secret).toString("base64");
}
