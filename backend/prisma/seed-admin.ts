import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, UserRole } from "../generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Creating production admin...");

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      passwordHash,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
    },
    create: {
      username: "admin",
      passwordHash,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin ready");
  console.log(`👤 Username: ${admin.username}`);
}

main()
  .catch((error) => {
    console.error("❌ Admin seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
