import { StatusBadge } from "@/components/shared";
import { formatDate } from "@/lib/formatters";

import { AdminUserActionButton } from "./admin-user-action-button";
import type { RecentUser } from "./admin-types";

function roleTone(role: RecentUser["role"]) {
  switch (role) {
    case "BUYER":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "SELLER":
      return "border-teal-200 bg-teal-50 text-teal-800";
    default:
      return "border-stone-200 bg-stone-100 text-stone-700";
  }
}

export function AdminUserCard({
  user,
  returnTo,
  suspendAction,
  reactivateAction,
}: {
  user: RecentUser;
  returnTo: string;
  suspendAction: (formData: FormData) => void | Promise<void>;
  reactivateAction: (formData: FormData) => void | Promise<void>;
}) {
  const isActive = user.status === "ACTIVE";

  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:bg-stone-50/50 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-950">{user.name}</h3>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${roleTone(
                user.role,
              )}`}
            >
              {user.role}
            </span>
            <StatusBadge status={user.status} />
          </div>
          <p className="text-sm text-stone-600">{user.company}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
            <span>{user.country}</span>
            <span className="text-stone-300">|</span>
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {isActive ? (
            <AdminUserActionButton
              action={suspendAction}
              targetUserId={user.id}
              returnTo={returnTo}
              label="Suspend"
              confirmMessage={`Suspend ${user.name}? This will hide the user and their eligible seller assets from public views.`}
              className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 transition hover:bg-rose-100"
            />
          ) : (
            <AdminUserActionButton
              action={reactivateAction}
              targetUserId={user.id}
              returnTo={returnTo}
              label="Reactivate"
              confirmMessage={`Reactivate ${user.name}? This will restore visibility where other rules allow it.`}
              className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-100"
            />
          )}
        </div>
      </div>
    </li>
  );
}
