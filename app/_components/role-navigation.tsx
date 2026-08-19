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
  "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_24px_-18px_rgba(51,92,255,0.75)] hover:bg-[var(--accent-strong)]";
const INACTIVE_CLASS =
  "border-[var(--border)] bg-white text-slate-600 hover:border-[var(--border-strong)] hover:bg-slate-50";

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
              className="rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-600"
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
            className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
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
