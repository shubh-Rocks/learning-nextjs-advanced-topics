import { Role } from "@/app/generated/prisma/enums";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const CurrentUser = await getCurrentUser();

    if (!CurrentUser || !checkUserPermission(CurrentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          erro: "you are not authorized to assign team",
        },
        {
          status: 401,
        },
      );
    }

    if (userId === CurrentUser.id) {
      return NextResponse.json(
        {
          erro: "you cannot change your own role",
        },
        {
          status: 401,
        },
      );
    }

    const { role } = await request.json();

    const validRoles = [Role.USER, Role.MANAGER];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role or you cannot have more than one Admin role user ",
        },
        { status: 404 },
      );
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
      include: {
        Team: true,
      },
    });

    return NextResponse.json({
      user: updateUser,
      message: `user role updated to ${role} successfully `,
    });
  } catch (error) {
    console.error("Role assignment error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found ")
    ) {
      return NextResponse.json(
        {
          error: "user not found ",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "user not found ",
      },
      { status: 500 },
    );
  }
}
