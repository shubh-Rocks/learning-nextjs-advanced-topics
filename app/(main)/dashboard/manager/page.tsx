import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect("/Unauthorized");
  }

  //   Fetch manager's own team members
  const prismaTeamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN },
        },
        include: {
          team: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  // Fetch All team members (cross-team veiw - exclude sensitive fields)

  const PrismaAllTeamMembers = prisma.user.findMany({
    where: {
      teamId: user.teamId,
      role: { not: Role.ADMIN },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
    },
  });

  return (
    <MangerDashboard
      myTeamMembers={prismaTeamMembers}
      allTeamMembers={PrismaAllTeamMembers}
      currentUser={user}
    />
  );
};

export default ManagerPage;
