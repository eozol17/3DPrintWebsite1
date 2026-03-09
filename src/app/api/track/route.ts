import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json(
      { error: "Sipariş numarası gerekli" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase() },
      select: {
        orderNumber: true,
        customerName: true,
        fileOriginalName: true,
        material: true,
        color: true,
        quantity: true,
        status: true,
        estimatedPrice: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
