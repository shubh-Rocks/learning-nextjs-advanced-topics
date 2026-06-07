import React from "react";
import Header from "../components/layout/Header";
import { apiClient } from "../lib/api.Client";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await apiClient.getCurrentUser();
  return (
    <>
      <Header user={user ?? null} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
};

export default MainLayout;
