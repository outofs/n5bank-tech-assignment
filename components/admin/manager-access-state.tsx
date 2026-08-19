import Link from "next/link";

import { EmptyState } from "@/components/shared";

type ManagerAccessStateProps = {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function ManagerAccessState({
  title = "Manager access required",
  description = "Select an active Platform Manager demo identity from the header to view the admin dashboard.",
  actionHref = "/",
  actionLabel = "Back to home",
}: ManagerAccessStateProps) {
  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title={title}
          description={description}
          action={
            <Link
              href={actionHref}
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              {actionLabel}
            </Link>
          }
        />
      </div>
    </main>
  );
}
