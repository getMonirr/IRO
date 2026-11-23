import type { Role } from "./types";

export const ROLES: Role[] = ["superAdmin", "admin", "editor", "member"];
export const RANK: Record<Role, number> = { superAdmin: 4, admin: 3, editor: 2, member: 1 };

// mirrors the backend ACCESS matrix (the backend is the real authority; this only hides what you can't use)
export const isAdmin = (r: Role) => RANK[r] >= RANK.admin; // delete, settings, users, audit log
export const isStaff = (r: Role) => RANK[r] >= RANK.editor; // read/write content and join requests
export const assignableRoles = (r: Role) => ROLES.filter((x) => RANK[x] < RANK[r]);
export const roleLabel: Record<Role, string> = { superAdmin: "Super admin", admin: "Admin", editor: "Editor", member: "Member" };
