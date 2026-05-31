import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { cookies } from "next/headers";
import { Role, User } from "@prisma/client";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (Password: string): Promise<String> => {
  return bcrypt.hash(Password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string };
  } catch (error) {
    return null;
  }
};

export const currentUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const decode = verifyToken(token);

    const userFromDb = await prisma.user.findUnique({
      where: { id: decode?.userId },
    });
    if (!userFromDb) return null;
    const { password, ...user } = userFromDb;
    return user as User;
  } catch (error) {
    console.error("error:", error);
    return null;
  }
};

export const checkUserPermission = (
  user: User,
  requiredRole: Role,
): boolean => {
  const roleHierarchy = { [Role.USER]: 0, [Role.MANAGER]: 1, [Role.ADMIN]: 2 };
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
