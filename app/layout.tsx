import type { Metadata } from "next";

import "./globals.css";
import AuthProvider from "./provider/AuthProvider";

export const metadata: Metadata = {
  title: "team access control",
  description:
    "Role based authentication system build with nextjs 16 and react 19",
  keywords: ["team", "access-control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
