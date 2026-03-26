import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.json({ error: "Sunucu yapılandırma hatası" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
    }

    const token = getSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.HTTPS === "true",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
