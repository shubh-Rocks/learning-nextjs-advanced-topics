"use client";
import { apiClient } from "@/app/lib/api.Client";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterState = {
  error?: string;
  success?: boolean;
};
const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterState,
      formdata: FormData,
    ): Promise<RegisterState> => {
      const name = formdata.get("name") as string;
      const email = formdata.get("email") as string;
      const password = formdata.get("password") as string;
      const teamCode = formdata.get("teamCode") as string;

      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });
        window.location.href = "/dashboard";

        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    },
    { error: undefined, success: undefined },
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-800 p-8 rounded-lg borer  border-slate-700 w-full max-w-md ">
        <form action={registerAction}>
          <div className="text-center mb-8 ">
            <h2 className="text-2xl font-bold text-white">
              create new account
            </h2>
            <p className="mt-2 text-sm text-slate-400 ">
              or
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                sign in to existing account
              </Link>
            </p>
          </div>
          {state?.error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-1 py-3 rounded mb-4">
              {state.error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className=" block text-sm font-medium text-slate-300 mb-1"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your Full Name"
                className=" w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>

            <div>
              {" "}
              <label
                htmlFor="name"
                className=" block text-sm font-medium text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                placeholder="Enter your Email"
                className=" w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className=" block text-sm font-medium text-slate-300 mb-1"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="text"
                autoComplete="new-password"
                required
                placeholder="Create a Password"
                className=" w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className=" block text-sm font-medium text-slate-300 mb-1"
              >
                Team Code (Optional)
              </label>

              <input
                id="teamCode"
                name="name"
                type="text"
                placeholder="Enter Team if you have one Code"
                className=" w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty if you dont have a code
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 w-full cursor-pointer text-white px-4 py-2 mt-5 hover:bg-700 rounded-md"
          >
            {isPending ? "Creating account...." : " Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
