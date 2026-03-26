import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { isAuthenticated } from "@/lib/auth";
import path from "path";

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya yüklenmedi" }, { status: 400 });
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `${ext} dosya türü desteklenmiyor. Desteklenen: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Dosya çok büyük. Maksimum 10MB." }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "uploads", "products");
    await mkdir(uploadsDir, { recursive: true });

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({ filename: uniqueName });
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
