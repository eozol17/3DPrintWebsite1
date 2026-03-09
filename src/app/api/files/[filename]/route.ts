import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  try {
    const sanitized = path.basename(filename);
    const filePath = path.join(process.cwd(), "uploads", sanitized);
    const fileBuffer = await readFile(filePath);

    const ext = path.extname(sanitized).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".stl": "application/sla",
      ".obj": "text/plain",
      ".3mf": "application/vnd.ms-package.3dmanufacturing-3dmodel+xml",
      ".step": "application/step",
      ".stp": "application/step",
      ".gcode": "text/plain",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${sanitized}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
