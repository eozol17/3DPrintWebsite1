import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: params.sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return NextResponse.json({ cart: null, items: [] });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: "itemId zorunlu" }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId: params.sessionId },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: params.sessionId },
    });

    if (cart) {
      await prisma.cart.delete({ where: { id: cart.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete cart error:", error);
    return NextResponse.json({ error: "Failed to delete cart" }, { status: 500 });
  }
}
