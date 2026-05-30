import "dotenv/config";
import { Prisma, PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const users: Prisma.UserCreateInput[] = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "change-me",
    role: "ADMIN",
  },
];

async function main() {
  for (const user of users) {
    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({ data: user });
    }
  }

  console.log("Database seeded");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
