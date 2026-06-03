import "dotenv/config";
import bcrypt from "bcryptjs";
import { Prisma, PrismaClient, Role } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const DUMMY_PASSWORD = "Password123!";
const SALT_ROUNDS = 12;

const teams = [
  {
    name: "Marketing",
    code: "MKT",
    description:
      "Plans product launches, brand campaigns, email funnels, and social content experiments for the company.",
  },
  {
    name: "Growth",
    code: "GRW",
    description:
      "Runs acquisition tests, referral programs, landing page experiments, and lifecycle conversion analysis.",
  },
  {
    name: "Sales",
    code: "SLS",
    description:
      "Manages customer pipeline, demos, pricing conversations, renewals, and account expansion opportunities.",
  },
  {
    name: "Product",
    code: "PRD",
    description:
      "Coordinates roadmap planning, user research, feature delivery, release notes, and product quality feedback.",
  },
] satisfies Prisma.TeamCreateManyInput[];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    role: Role.ADMIN,
  },
  {
    name: "Maya Sharma",
    email: "maya.sharma@example.com",
    role: Role.MANAGER,
    teamCode: "MKT",
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    role: Role.USER,
    teamCode: "MKT",
  },
  {
    name: "Priya Kapoor",
    email: "priya.kapoor@example.com",
    role: Role.USER,
    teamCode: "MKT",
  },
  {
    name: "Neha Rao",
    email: "neha.rao@example.com",
    role: Role.MANAGER,
    teamCode: "GRW",
  },
  {
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    role: Role.USER,
    teamCode: "GRW",
  },
  {
    name: "Ananya Das",
    email: "ananya.das@example.com",
    role: Role.USER,
    teamCode: "GRW",
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    role: Role.MANAGER,
    teamCode: "SLS",
  },
  {
    name: "Isha Nair",
    email: "isha.nair@example.com",
    role: Role.USER,
    teamCode: "SLS",
  },
  {
    name: "Dev Patel",
    email: "dev.patel@example.com",
    role: Role.USER,
    teamCode: "SLS",
  },
  {
    name: "Sofia Fernandes",
    email: "sofia.fernandes@example.com",
    role: Role.MANAGER,
    teamCode: "PRD",
  },
  {
    name: "Aarav Iyer",
    email: "aarav.iyer@example.com",
    role: Role.USER,
    teamCode: "PRD",
  },
  {
    name: "Tara Malhotra",
    email: "tara.malhotra@example.com",
    role: Role.USER,
    teamCode: "PRD",
  },
];

async function seedTeams() {
  const teamIdsByCode = new Map<string, string>();

  for (const team of teams) {
    const savedTeam = await prisma.team.upsert({
      where: { code: team.code },
      update: {
        name: team.name,
        description: team.description,
      },
      create: team,
    });

    teamIdsByCode.set(savedTeam.code, savedTeam.id);
  }

  return teamIdsByCode;
}

async function seedUsers(teamIdsByCode: Map<string, string>) {
  const password = await bcrypt.hash(DUMMY_PASSWORD, SALT_ROUNDS);

  for (const user of users) {
    const teamId = user.teamCode ? teamIdsByCode.get(user.teamCode) : null;
    const data: Prisma.UserUncheckedCreateInput = {
      name: user.name,
      email: user.email,
      password,
      role: user.role,
      teamId,
    };

    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data,
      });
      continue;
    }

    await prisma.user.create({ data });
  }
}

async function main() {
  const teamIdsByCode = await seedTeams();
  await seedUsers(teamIdsByCode);

  console.log(
    `Database seeded with ${teams.length} teams and ${users.length} users.`,
  );
  console.log(`Dummy user password: ${DUMMY_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
