import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya yüklenmedi" }, { status: 400 });
    }

    const allowedExtensions = [".stl", ".obj", ".3mf", ".step", ".stp", ".iges", ".igs", ".gcode"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `${ext} dosya türü desteklenmiyor. Desteklenen: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya çok büyük. Maksimum boyut 100MB." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      fileName: uniqueName,
      fileOriginalName: file.name,
      filePath: filePath,
      fileSize: file.size,
    });
  } catch {
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
