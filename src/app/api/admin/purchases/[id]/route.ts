import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, slug: true, images: true } } },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("Get purchase error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const purchase = await prisma.purchase.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ purchase });
  } catch (error) {
    console.error("Update purchase error:", error);
    return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 });
  }
}
