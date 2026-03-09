import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [total, pending, printing, completed, recent] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["pending", "reviewing"] } } }),
      prisma.order.count({ where: { status: "printing" } }),
      prisma.order.count({ where: { status: { in: ["completed", "shipped"] } } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: { total, pending, printing, completed },
      recent,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
