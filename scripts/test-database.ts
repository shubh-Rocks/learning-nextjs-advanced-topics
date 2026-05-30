import "dotenv/config";
import prisma from "../app/lib/prisma";

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  const userCount = await prisma.user.count();

  console.log("Database connection successful");
  console.log(`Users in database: ${userCount}`);
}

main()
  .catch((error) => {
    console.error("Database test failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
