import { Prisma, Role } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const validRoles = [Role.ADMIN, Role.MANAGER, Role.USER];

function isValidRole(role: string): role is (typeof validRoles)[number] {
  return validRoles.includes(role as (typeof validRoles)[number]);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          message: "you are not authenticated",
        },
        {
          status: 401,
        },
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    const where: Prisma.UserWhereInput = {};
    if (user.role === Role.ADMIN) {
      // Admin can see all users
    } else if (user.role === Role.MANAGER) {
      // Manager can see users in their teams or cross team users but not cross team managers
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    if (teamId) {
      where.teamId = teamId;
    }
    if (role && isValidRole(role)) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("get users error:", error);
    return NextResponse.json(
      {
        Message: "Something went wrong,Internal server error",
      },
      { status: 500 },
    );
  }
}
