"use client";
import {
  createContext,
  useContext,
  useActionState,
  useEffect,
  useState,
} from "react";
import { AuthContextType, User } from "../types";
import { apiClient } from "../lib/api.Client";
import { Role } from "@prisma/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type LoginState = {
  success?: boolean;
  user?: User | null;
  error: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [loginState, loginAction, isLoginPending] = useActionState<LoginState, FormData>(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const data = (await apiClient.login(email, password)) as unknown as {
          user: User;
        };
        setUser(data.user);
        return { success: true, user: data.user, error: "" };
      } catch (error) {
        console.error("error", error);
        return {
          error: error instanceof Error ? error.message : "login failed",
        };
      }
    },
    { error: "", success: undefined, user: undefined } as LoginState,
  );
  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const hashPermission = (requiredRole: Role): boolean => {
    if (!user) return false;
    const roleHierarchy: Record<Role, number> = {
      [Role.USER]: 0,
      [Role.MANAGER]: 1,
      [Role.ADMIN]: 2,
    };
    return roleHierarchy[user.role as Role] >= roleHierarchy[requiredRole];
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData || null);
      } catch (error) {
        console.error("failed to load user:", error);
      }
    };
    loadUser();
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginAction,
        logout,
        hashPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }

  return context;
};

export default AuthProvider;
