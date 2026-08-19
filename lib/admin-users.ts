import { Prisma } from "@prisma/client";

export const adminModerationUserSelect = {
  id: true,
  name: true,
  company: true,
  role: true,
  country: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type AdminModerationUser = Prisma.UserGetPayload<{
  select: typeof adminModerationUserSelect;
}>;

export const ADMIN_USER_ROLES = ["BUYER", "SELLER"] as const;
export const ADMIN_USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;

export function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b),
  );
}
