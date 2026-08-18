import Link from "next/link";

type MessagesTab = {
  label: string;
  value: "all" | "received" | "sent";
  count: number;
};

type MessagesTabsProps = {
  currentView: MessagesTab["value"];
  tabs: MessagesTab[];
};

const TAB_BASE_CLASS =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition";

export function MessagesTabs({ currentView, tabs }: MessagesTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.value === currentView;

        return (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/messages" : `/messages?view=${tab.value}`}
            className={`${TAB_BASE_CLASS} ${
              active
                ? "border-stone-950 bg-stone-950 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                active ? "bg-white/15 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
