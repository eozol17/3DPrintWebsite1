import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  try {
    const sanitized = path.basename(filename);
    const filePath = path.join(process.cwd(), "uploads", "products", sanitized);
    const fileBuffer = await readFile(filePath);

    const ext = path.extname(sanitized).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeTypes[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
