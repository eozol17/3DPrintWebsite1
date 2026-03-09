import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl.startsWith("file:./")
      ? `file:${path.join(process.cwd(), dbUrl.slice(5))}`
      : dbUrl,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
