import "server-only";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/demo-session";

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireSignedInDemoUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthorizationError("Sign in with a demo user first.");
  }

  return user;
}

export async function requireActiveDemoUser() {
  const user = await requireSignedInDemoUser();

  if (user.status !== "ACTIVE") {
    throw new AuthorizationError("This demo user is suspended.");
  }

  return user;
}

export async function requireBuyerDemoUser() {
  const user = await requireActiveDemoUser();

  if (user.role !== "BUYER") {
    throw new AuthorizationError("Buyer access required.");
  }

  return user;
}

export async function requireSellerDemoUser() {
  const user = await requireActiveDemoUser();

  if (user.role !== "SELLER") {
    throw new AuthorizationError("Seller access required.");
  }

  return user;
}

export async function requireManagerDemoUser() {
  const user = await requireActiveDemoUser();

  if (user.role !== "MANAGER") {
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
