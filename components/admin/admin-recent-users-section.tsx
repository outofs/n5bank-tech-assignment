import { EmptyState, StatusBadge } from "@/components/shared";
import { formatDate } from "@/lib/formatters";

import type { RecentUser } from "./admin-types";

function roleTone(role: RecentUser["role"]) {
  switch (role) {
    case "BUYER":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "SELLER":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "MANAGER":
      return "border-stone-300 bg-stone-100 text-stone-800";
    default:
      return "border-stone-200 bg-stone-100 text-stone-700";
  }
}

export function AdminRecentUsersSection({ users }: { users: RecentUser[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users yet"
        description="Users will appear here once records exist in PostgreSQL."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-stone-950">{user.name}</h3>
              <p className="text-sm text-stone-600">{user.company}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={user.status} />
              <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${roleTone(
                user.role,
              )}`}
            >
              {user.role}
            </span>
            <span className="text-sm text-stone-600">{user.country}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
