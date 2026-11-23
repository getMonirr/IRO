export type Bi = { bn: string; en: string }
export const emptyBi = (): Bi => ({ bn: "", en: "" });
export const toBi = (v?: Partial<Bi> | null): Bi => ({ bn: v?.bn ?? "", en: v?.en ?? "" });

export type Role = "superAdmin" | "admin" | "editor" | "member";

export type UserRec = {
  _id: string; id: string; name: string; email: string; role: Role;
  status: "in-progress" | "blocked"; needsPasswordChange: boolean; lastLoginAt?: string; createdAt?: string;
};

export type ProgramData = {
  slug: string; icon: string; order: number; status: "ongoing" | "planned"; published: boolean;
  title: Bi; short: Bi; body: Bi; tagline: Bi; points: Bi[];
  figures: { value: Bi; label: Bi }[];
  ayah: { arabic: string; text: Bi; source: Bi };
};
export type ProgramRec = ProgramData & { _id: string };

export const ITEM_GROUPS = ["stat", "principle", "goal", "department", "roadmap", "joinWay"] as const;
export type ItemGroup = (typeof ITEM_GROUPS)[number];
export type ItemData = { group: ItemGroup; order: number; published: boolean; icon: string; value: Bi; title: Bi; text: Bi };
export type ItemRec = ItemData & { _id: string };

export type JoinRec = {
  _id: string; name: string; contact: string; type: string; message: string; lang: "bn" | "en";
  status: "new" | "contacted" | "closed"; note: string; createdAt: string;
};

export type AuditRec = {
  _id: string; actor?: { name: string; email: string } | null; actorRole?: string; action: string;
  resource: string; resourceId?: string; ip?: string; meta?: Record<string, unknown>; createdAt: string;
};
