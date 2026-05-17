import { PrismaClient, Role } from "@prisma/client";

if (!("BUYER" in Role)) {
  throw new Error(
    "Prisma client is out of date (missing Role.BUYER). Stop the server, run: npx prisma generate, then start again.",
  );
}

export const prisma = new PrismaClient();
