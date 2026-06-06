import { getCurrentUser } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const DashboardLayout = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case Role.ADMIN:
      redirect("/dasboard/admin");
    case Role.MANAGER:
      redirect("/dasboard/manager");
    case Role.USER:
      redirect("/dasboard/user");

    default:
      break;
  }
};

export default DashboardLayout;
