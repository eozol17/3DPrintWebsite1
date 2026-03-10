import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        items: {
          include: { product: { select: { name: true, slug: true, images: true } } },
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
