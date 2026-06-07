"use client";

import { apiClient } from "@/app/lib/api.Client";
import { Role, Team, User } from "@prisma/client";
import { useTransition } from "react";

interface AdminDashboardPage {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const AdminDashboard = ({ users, teams, currentUser }: AdminDashboardPage) => {
  const [isPending, startTransition] = useTransition();

  const handleTeamAssignment = async (
    userId: string,
    teamId: string | null,
  ) => {
    startTransition(async () => {
      try {
        await apiClient.assignUserteam(userId, teamId ?? "");
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Error Updating team assingment",
        );
      }
    });
  };

  const handleRoleAssignment = async (userId: string, newRole: Role) => {
    if (userId === currentUser.id) {
      alert("you cannot change your own role ");
      return;
    }
    startTransition(async () => {
      try {
        await apiClient.updateUserRole(userId, newRole);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Error Updating team assingment",
        );
      }
    });
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white ">
          {" "}
          Admin Dashboard
        </h1>
        <p className="text-slate-300  ">user and team Management </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700 ">
            <h3 className="font-semibold text-white">User({users.length})</h3>
            <p className="text-slate-400 text-sm ">
              Manage roles and team assingment
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Role</th>
                  <th className="text-left py-2 text-slate-300">Team</th>
                  <th className="text-left py-2 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700">
                    <td className="py-2 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-slate-500 text-[15px]">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleAssignment(user.id, e.target.value as Role)
                        }
                        disabled={isPending || user.id === currentUser.id}
                        className="bg-slate-900 border border-slate-700 rounded-lg"
                      >
                        <option value={Role.USER}>USER</option>
                        <option value={Role.ADMIN}>ADMIN</option>
                        <option value={Role.MANAGER}>MANAGER</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <select
                        value={user.teamId || ""}
                        onChange={(e) =>
                          handleTeamAssignment(user.id, e.target.value || null)
                        }
                        disabled={isPending}
                        className="bg-slate-900 border border-slate-700 rounded-lg"
                      >
                        <option value="">No Team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {user.team && (
                        <span className="text-xs text-slate-500">
                          {user.team.code}
                        </span>
                      )}
                    </td>
                    <td>
                      {user.teamId && (
                        <button
                          onClick={() => handleTeamAssignment(user.id, null)}
                          disabled={isPending}
                          className="text-red-400 hover:text-red-300 text-xs disabled:opacity"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700 ">
            <h3 className="font-semibold text-white">Team({teams.length})</h3>
            <p className="text-slate-400 text-sm ">
              Team Overview
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Code</th>
                  <th className="text-left py-2 text-slate-300">Members</th>
                  <th className="text-left py-2 text-slate-300">Managers</th>
                </tr>
              </thead>
              <tbody>
                {teams.map}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
