import { AdminFutureNavigation } from "./admin-future-navigation";
import { AdminMetricCard } from "./admin-metric-card";
import { AdminRecentAssetsSection } from "./admin-recent-assets-section";
import { AdminRecentUsersSection } from "./admin-recent-users-section";
import { AdminSectionCard } from "./admin-section-card";
import type { DashboardMetric, RecentAsset, RecentUser } from "./admin-types";
import { PageHeader } from "@/components/shared";

type AdminDashboardProps = {
  company: string;
  metrics: DashboardMetric[];
  recentAssets: RecentAsset[];
  recentUsers: RecentUser[];
};

export function AdminDashboard({
  company,
  metrics,
  recentAssets,
  recentUsers,
}: AdminDashboardProps) {
  return (
    <main>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Platform manager"
          title="Admin dashboard"
          description={`Operational overview for ${company}, using the same visual tokens as the marketplace while staying denser and more utilitarian.`}
          actions={
            <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-700">
              {metrics.reduce((sum, metric) => sum + metric.value, 0)} tracked records
            </div>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <AdminMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <AdminSectionCard
            title="Recent assets"
            description="Most recently created or updated assets across the platform."
          >
            <AdminRecentAssetsSection assets={recentAssets} />
          </AdminSectionCard>

          <AdminSectionCard
            title="Recent users"
            description="Most recently joined users across buyer, seller, and manager roles."
          >
            <AdminRecentUsersSection users={recentUsers} />
          </AdminSectionCard>
        </section>

        <AdminFutureNavigation />
      </div>
    </main>
  );
}
