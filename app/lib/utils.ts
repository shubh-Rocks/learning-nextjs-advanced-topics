import { Team, User } from "@prisma/client";

export function transformUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    password: user.password,
    teamId: user.teamId || undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function transformUsers(users: any[]): User[] {
  return users.map(transformUser);
}

export function transformTeam(team: any): Team & { members: User[] } {
  return {
    id: team.id,
    name: team.name,
    description: team.description || undefined,
    code: team.code,
    members: team.members || [],
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}

export function transformTeams(teams: any[]): (Team & { members: User[] })[] {
  return teams.map(transformTeam);
}
