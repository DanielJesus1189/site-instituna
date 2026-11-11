export function SkeletonCard() {
  return (
    <div className="skeleton-card animate-pulse" aria-hidden="true">
      <div className="skeleton-block h-3 w-24" />
      <div className="mt-4 grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-5 sm:gap-6">
        <div className="skeleton-block aspect-[3/4] w-full" />
        <div className="flex flex-col gap-3">
          <div className="skeleton-block h-3 w-20" />
          <div className="skeleton-block h-7 w-4/5" />
          <div className="skeleton-block h-3 w-2/5" />
          <div className="skeleton-block mt-4 h-3 w-full" />
          <div className="skeleton-block h-3 w-11/12" />
          <div className="skeleton-block h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}
