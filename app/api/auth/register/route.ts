import { hashPassword } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email & password are required or not valid",
        },
        { status: 400 },
      );
    }

    // find existing user
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email address exists",
        },
        { status: 400 },
      );
    }
    let teamId: string | undefined;
    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: { code: teamCode },
      });

      if (!team) {
        return NextResponse.json(
          {
            error: "please enter a valid team code",
          },
          { status: 400 },
        );
      }

      teamId = team.id;
    }

    const hashedPassword = await hashPassword(password);

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: String(hashedPassword),
        role,
        teamId,
      },
      include: {
        Team: true,
      },
    });

    const token = generateToken(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId,
        team: user.Team,
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    console.error("registrtion failed");
    return NextResponse.json(
      {
        error: "internal server error, somthing went wrong!",
      },
      { status: 500 },
    );
  }
}
