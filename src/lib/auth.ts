import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  }
  return secret;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  if (!session) return false;

  try {
    return session.value === Buffer.from(getSecret()).toString("base64");
  } catch {
    return false;
  }
}

export function getSessionToken(): string {
  return Buffer.from(getSecret()).toString("base64");
}
