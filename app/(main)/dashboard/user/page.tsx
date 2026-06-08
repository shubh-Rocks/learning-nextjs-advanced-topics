import UserDashboard from "@/app/components/dashboard/UserDashboard";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  //   Fetch user-Specific data
  const TeamMembers = user.teamId
    ? await prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
          teamId: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    : [];

  return (
    <UserDashboard myTeamMembers={TeamMembers as User[]} currentUser={user} />
  );
};

export default UserPage;
