import type { User } from "@prisma/client";

interface ManagerDashboardProps {
  myTeamMembers: User[];
  allTeamMembers: User[];
  currentUser: User;
}

export default function MangerDashboard({
  myTeamMembers,
  allTeamMembers,
  currentUser,
}: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">
          Manager Dashboard
        </h1>
        <p className="text-slate-300 ">Team Management view</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Team Members */}

        <div className="bg-slate-800 border border-slate-600 rounded-lg ">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              Team Members {allTeamMembers.length}
            </h3>
          </div>
          <div className="p-4 ">
            {allTeamMembers.map((member: User) => (
              <div
                key={member.id}
                className="border-b border-slate-700 py-2 last:border-b-0"
              >
                <p className="font-medium text-white">{member.name}</p>
                <p className="text-sm text-slate-400">
                  {member.email} • {member.role} • {member.teamId ?? "No team"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-600 rounded-lg ">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              Team Members {myTeamMembers.length}
            </h3>
          </div>
          <div className="p-4">
            {myTeamMembers.map((member) => (
              <div
                key={member.id}
                className="border-b border-slate-700 py-2 last:border-b-0"
              >
                <p className="font-medium text-white">{member.name}</p>
                <p className="text-sm text-slate-400">
                  {member.email} • {member.role} • {member.teamId ?? "No team"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
