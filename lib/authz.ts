import "server-only";

import type { CurrentDemoUser } from "@/lib/demo-session";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/demo-session";

export type ActiveDemoUser = CurrentDemoUser & { status: "ACTIVE" };
export type BuyerDemoUser = ActiveDemoUser & { role: "BUYER" };
export type SellerDemoUser = ActiveDemoUser & { role: "SELLER" };
export type ManagerDemoUser = ActiveDemoUser & { role: "MANAGER" };

function isActiveDemoUser(user: CurrentDemoUser): user is ActiveDemoUser {
  return user.status === "ACTIVE";
}

function isBuyerDemoUser(user: ActiveDemoUser): user is BuyerDemoUser {
  return user.role === "BUYER";
}

function isSellerDemoUser(user: ActiveDemoUser): user is SellerDemoUser {
  return user.role === "SELLER";
}

function isManagerDemoUser(user: ActiveDemoUser): user is ManagerDemoUser {
  return user.role === "MANAGER";
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireSignedInDemoUser(): Promise<CurrentDemoUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthorizationError("Sign in with a demo user first.");
  }

  return user;
}

export async function requireActiveDemoUser(): Promise<ActiveDemoUser> {
  const user = await requireSignedInDemoUser();

  if (!isActiveDemoUser(user)) {
    throw new AuthorizationError("This demo user is suspended.");
  }

  return user;
}

export async function requireBuyerDemoUser(): Promise<BuyerDemoUser> {
  const user = await requireActiveDemoUser();

  if (!isBuyerDemoUser(user)) {
    throw new AuthorizationError("Buyer access required.");
  }

  return user;
}

export async function requireSellerDemoUser(): Promise<SellerDemoUser> {
  const user = await requireActiveDemoUser();

  if (!isSellerDemoUser(user)) {
    throw new AuthorizationError("Seller access required.");
  }

  return user;
}

export async function requireManagerDemoUser(): Promise<ManagerDemoUser> {
  const user = await requireActiveDemoUser();

  if (!isManagerDemoUser(user)) {
    throw new AuthorizationError("Manager access required.");
  }

  return user;
}

export async function requireSellerOwnsAsset(assetId: string) {
  const user = await requireSellerDemoUser();

  const asset = await db.asset.findUnique({
    where: { id: assetId },
    select: {
      id: true,
      sellerId: true,
    },
  });

  if (!asset) {
    throw new AuthorizationError("Asset not found.");
  }

  if (asset.sellerId !== user.id) {
    throw new AuthorizationError("You do not own this asset.");
  }

  return asset;
}
