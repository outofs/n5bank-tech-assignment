import type { RecentUser } from "./admin-types";
import { AdminUserCard } from "./admin-user-card";

type AdminUsersListProps = {
  users: RecentUser[];
  returnTo: string;
  suspendAction: (formData: FormData) => void | Promise<void>;
  reactivateAction: (formData: FormData) => void | Promise<void>;
};

export function AdminUsersList({
  users,
  returnTo,
  suspendAction,
  reactivateAction,
}: AdminUsersListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
        <div className="mx-auto max-w-md space-y-2">
          <h2 className="text-base font-semibold text-stone-950">No matching users</h2>
          <p className="text-sm leading-6 text-stone-600">
            Adjust the filters to see buyer and seller users available for moderation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {users.map((user) => (
        <AdminUserCard
          key={user.id}
          user={user}
          returnTo={returnTo}
          suspendAction={suspendAction}
          reactivateAction={reactivateAction}
        />
      ))}
    </ul>
  );
}
