import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect("/login");
  }

  //   Fetch user-Specific data
  const TeamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
    : [];

  return <UserDashboard myTeamMembers={TeamMembers} currentUser={user} />;
};

export default UserPage;
