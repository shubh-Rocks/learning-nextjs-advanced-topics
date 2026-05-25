export enum Role{
    ADMIN = "ADMIN",
    MANGER = "MANGER",
    GUEST = "GUEST",
}

export interface user{
    id: string;
    name: string;
    email:string;
    role: Role;
    teamId?: string;
    team?: Team;
    createdAt: Date;
    updatedAt: Date;

}

export interface team{
    id:string;
    name:string;
    description?:string | null;
    code:string;
    members:user[];
    createdAt:Date;
    updatedAt:Date;
}