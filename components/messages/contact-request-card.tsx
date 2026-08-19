import Link from "next/link";

import { formatDateTime } from "@/lib/formatters";
import type { ContactRequestMessageRow } from "@/lib/messages";
import { hasAssetContext, isPublicAssetContext } from "@/lib/messages";
import type { ActiveDemoUser } from "@/lib/authz";

type ContactRequestCardProps = {
  request: ContactRequestMessageRow;
  direction: "sent" | "received";
  currentUser: Pick<ActiveDemoUser, "id" | "role">;
};

function truncateMessage(message: string, maxLength = 140) {
  if (message.length <= maxLength) {
    return message;
  }

  return `${message.slice(0, maxLength - 1).trimEnd()}...`;
}

function AssetContextLink({
  request,
  currentUser,
}: {
  request: ContactRequestMessageRow;
  currentUser: Pick<ActiveDemoUser, "id" | "role">;
}) {
  if (!hasAssetContext(request)) {
    return <span>General inquiry</span>;
  }

  const asset = request.asset;
  const title = asset.title;
  const sellerRoute = `/seller/assets/${asset.id}/edit`;

  if (currentUser.role === "SELLER" && asset.sellerId === currentUser.id) {
    return (
      <Link
        href={sellerRoute}
        className="font-medium text-stone-900 transition hover:text-stone-700"
      >
        Regarding: {title}
      </Link>
    );
  }

  if (currentUser.role === "BUYER" && isPublicAssetContext(asset)) {
    return (
      <Link
        href={`/marketplace/${asset.id}`}
        className="font-medium text-stone-900 transition hover:text-stone-700"
      >
        Regarding: {title}
      </Link>
    );
  }

  return <span>Regarding: {title}</span>;
}

function directionTone(direction: "sent" | "received") {
  return direction === "received"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-stone-200 bg-stone-100 text-stone-700";
}

export function ContactRequestCard({
  request,
  direction,
  currentUser,
}: ContactRequestCardProps) {
  const counterpart = direction === "sent" ? request.recipient : request.sender;

  return (
    <article className="bg-white px-4 py-4 transition hover:bg-slate-50/70 sm:px-5 sm:py-4.5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-950">{counterpart.name}</h3>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${directionTone(direction)}`}
              >
                {direction === "sent" ? "Sent" : "Received"}
              </span>
            </div>
            <p className="text-sm text-slate-600">{counterpart.company}</p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
            <p className="text-xs text-slate-500">
              {formatDateTime(request.createdAt)}
            </p>
            <p className="text-[0.72rem] font-medium text-slate-400">
              {request.status}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-sm leading-6 text-slate-700">
          <p>
            <AssetContextLink request={request} currentUser={currentUser} />
          </p>
          <p className="max-w-3xl text-slate-600">{truncateMessage(request.message)}</p>
        </div>
      </div>
    </article>
  );
}
