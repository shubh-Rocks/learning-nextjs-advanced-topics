import { verifyPassword } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "email & password are required or not valid",
        },
        { status: 400 },
      );
    }

    // find existing user
    const userfromDb = await prisma.user.findFirst({
      where: { email },
      include: { team: true },
    });

    if (!userfromDb) {
      return NextResponse.json(
        {
          message: "invalid user not found",
        },
        {
          status: 401,
        },
      );
    }

    const isValidPassword = await verifyPassword(password, userfromDb.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    const token = generateToken(userfromDb.id);

    const response = NextResponse.json({
      user: {
        id: userfromDb.id,
        email: userfromDb.email,
        name: userfromDb.name,
        role: userfromDb.role,
        teamId: userfromDb.teamId,
        team: userfromDb.team,
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
  } catch (error) {
    console.error("login failed",error);
    return NextResponse.json(
      {
        error: "internal server error, somthing went wrong!",
      },
      { status: 500 },
    );
  }
}
