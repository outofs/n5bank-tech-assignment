import { cookies } from "next/headers";

import { db } from "@/lib/db";

export const DEMO_USER_COOKIE = "n5deal-demo-user-id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEMO_USER_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      buyerProfile: true,
      sellerProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function setDemoUser(userId: string) {
  "use server";

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Unknown demo user.");
  }

  const cookieStore = await cookies();

  cookieStore.set(DEMO_USER_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return user.id;
}

export async function clearDemoUser() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_USER_COOKIE);
}
