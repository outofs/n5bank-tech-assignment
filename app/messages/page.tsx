import Link from "next/link";

import { ContactRequestCard, MessagesTabs } from "@/components/messages";
import { EmptyState, PageHeader } from "@/components/shared";
import {
  AuthorizationError,
  requireActiveDemoUser,
  type ActiveDemoUser,
} from "@/lib/authz";
import { db } from "@/lib/db";
import { contactRequestMessagesSelect } from "@/lib/messages";

type MessagesView = "all" | "received" | "sent";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeView(value: string | string[] | undefined): MessagesView {
  const candidate = firstParam(value);
  return candidate === "received" || candidate === "sent" ? candidate : "all";
}

type MessagesSearchParams = Promise<{
  view?: string | string[];
}>;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: MessagesSearchParams;
}) {
  let currentUser: ActiveDemoUser;

  try {
    currentUser = await requireActiveDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <main className="bg-stone-50/80">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <EmptyState
              title="Demo access required"
              description="Select an active demo identity from the header to view messages."
              action={
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Back to home
                </Link>
              }
            />
          </div>
        </main>
      );
    }

    throw error;
  }

  const { view: rawView } = await searchParams;
  const view = normalizeView(rawView);

  const requests = await db.contactRequest.findMany({
    where: {
      OR: [{ senderId: currentUser.id }, { recipientId: currentUser.id }],
    },
    select: contactRequestMessagesSelect,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const sentRequests = requests.filter((request) => request.senderId === currentUser.id);
  const receivedRequests = requests.filter(
    (request) => request.recipientId === currentUser.id,
  );
  const visibleRequests =
    view === "received"
      ? receivedRequests
      : view === "sent"
        ? sentRequests
        : requests;

  const totalCount = requests.length;
  const sentCount = sentRequests.length;
  const receivedCount = receivedRequests.length;
  const visibleCount = visibleRequests.length;
  const tabs = [
    { label: "All", value: "all" as const, count: totalCount },
    { label: "Received", value: "received" as const, count: receivedCount },
    { label: "Sent", value: "sent" as const, count: sentCount },
  ];

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Inbox"
          title="Messages"
          description="Contact requests sent and received by the current demo user, scoped directly from PostgreSQL."
          actions={
            <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
              {visibleCount} shown
            </div>
          }
        />

        <section className="space-y-4">
          <MessagesTabs currentView={view} tabs={tabs} />

          {visibleRequests.length === 0 ? (
            <EmptyState
              title={
                view === "received"
                  ? "No received requests"
                  : view === "sent"
                    ? "No sent requests"
                    : "No messages yet"
              }
              description={
                view === "received"
                  ? "Requests addressed to this user will appear here."
                  : view === "sent"
                    ? "Requests created by this user will appear here."
                    : "Sent and received requests will appear here once contact requests exist."
              }
            />
          ) : (
            <ul className="space-y-3">
              {visibleRequests.map((request) => (
                <li key={request.id}>
                  <ContactRequestCard
                    request={request}
                    direction={request.senderId === currentUser.id ? "sent" : "received"}
                    currentUser={currentUser}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
