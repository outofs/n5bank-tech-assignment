import { LoadingSkeleton } from "@/components/shared";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10">
      <div className="space-y-4">
        <LoadingSkeleton lines={2} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <LoadingSkeleton lines={4} />
          <LoadingSkeleton lines={4} />
          <LoadingSkeleton lines={4} />
        </div>
      </div>
    </main>
  );
}
