type LoadingSkeletonProps = {
  lines?: number;
};

export function LoadingSkeleton({ lines = 3 }: LoadingSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="rounded-2xl border border-stone-200 bg-white p-6"
    >
      <div className="space-y-3">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 animate-pulse rounded bg-stone-200 ${
              index === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
