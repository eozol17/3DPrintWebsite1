import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePurchaseNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, customerName, customerEmail, customerPhone, address } =
      await request.json();

    if (!sessionId || !customerName || !customerEmail || !address) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `"${item.product.name}" artık satışta değil` },
          { status: 409 }
        );
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `"${item.product.name}" için yeterli stok yok (mevcut: ${item.product.stock})` },
          { status: 409 }
        );
      }
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let orderNumber: string;
    let isUnique = false;
    do {
      orderNumber = generatePurchaseNumber();
      const existing = await prisma.purchase.findUnique({ where: { orderNumber } });
      isUnique = !existing;
    } while (!isUnique);

    const purchase = await prisma.$transaction(async (tx) => {
      const newPurchase = await tx.purchase.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          address,
          totalPrice,
          status: "pending",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cart.delete({ where: { id: cart.id } });

      return newPurchase;
    });

    return NextResponse.json({ purchase }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
