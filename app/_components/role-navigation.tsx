"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type RoleNavigationProps = {
  role: "BUYER" | "SELLER" | "MANAGER";
  items: readonly string[];
};

type NavItem = {
  label: string;
  href: string;
  activePrefixes: string[];
  activeExact?: string[];
};

function getNavItem(role: RoleNavigationProps["role"], label: string): NavItem | null {
  if (role === "MANAGER" && label === "Admin") {
    return {
      label,
      href: "/admin",
      activePrefixes: ["/admin"],
      activeExact: ["/admin"],
    };
  }

  if (role === "BUYER" && label === "Marketplace") {
    return {
      label,
      href: "/marketplace",
      activePrefixes: ["/marketplace"],
      activeExact: ["/marketplace"],
    };
  }

  if (role === "SELLER" && label === "My Assets") {
    return {
      label,
      href: "/seller/assets",
      activePrefixes: ["/seller/assets"],
      activeExact: ["/seller/assets"],
    };
  }

  if (role === "SELLER" && label === "Buyers") {
    return {
      label,
      href: "/buyers",
      activePrefixes: ["/buyers"],
      activeExact: ["/buyers"],
    };
  }

  if ((role === "BUYER" || role === "SELLER") && label === "Messages") {
    return {
      label,
      href: "/messages",
      activePrefixes: ["/messages"],
      activeExact: ["/messages"],
    };
  }

  if (role === "BUYER" && label === "Profile") {
    return {
      label,
      href: "/profile",
      activePrefixes: ["/profile"],
      activeExact: ["/profile"],
    };
  }

  return null;
}

function isActivePath(
  pathname: string | null,
  item: NavItem,
  role: RoleNavigationProps["role"],
) {
  if (!pathname) {
    return false;
  }

  if (role === "MANAGER" && item.href === "/admin") {
    return pathname.startsWith("/admin");
  }

  if (item.activeExact?.includes(pathname)) {
    return true;
  }

  if (role === "BUYER" && item.href === "/marketplace") {
    return pathname.startsWith("/marketplace/");
  }

  if (role === "SELLER" && item.href === "/seller/assets") {
    return pathname.startsWith("/seller/assets/");
  }

  if (role === "SELLER" && item.href === "/buyers") {
    return pathname.startsWith("/buyers/");
  }

  if ((role === "BUYER" || role === "SELLER") && item.href === "/messages") {
    return pathname.startsWith("/messages/");
  }

  if (role === "BUYER" && item.href === "/profile") {
    return pathname.startsWith("/profile/");
  }

  return item.activePrefixes.some((prefix) => pathname.startsWith(prefix));
}

const ACTIVE_CLASS =
  "border-stone-950 bg-stone-950 text-white shadow-sm hover:bg-stone-800";
const INACTIVE_CLASS =
  "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-100";

export function RoleNavigation({ role, items }: RoleNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((label) => {
        const item = getNavItem(role, label);

        if (!item) {
          return (
            <span
              key={label}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
            >
              {label}
            </span>
          );
        }

        const isActive = isActivePath(pathname, item, role);

        return (
          <Link
            key={label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
