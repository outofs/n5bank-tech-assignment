import "server-only";

import { db } from "@/lib/db";

export const demoRoleDefinitions = [
  { role: "BUYER", label: "Buyer", navigation: ["Marketplace", "Profile", "Messages"] },
  { role: "SELLER", label: "Seller", navigation: ["My Assets", "Buyers", "Messages"] },
  { role: "MANAGER", label: "Platform Manager", navigation: ["Admin"] },
] as const;

export async function getSeededDemoUsers() {
  const users = await Promise.all(
    demoRoleDefinitions.map(async ({ role }) =>
      db.user.findFirst({
        where: {
          role,
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          name: true,
          company: true,
          role: true,
          status: true,
        },
      }),
    ),
  );

  return demoRoleDefinitions.map((definition, index) => ({
    ...definition,
    user: users[index],
  }));
}
