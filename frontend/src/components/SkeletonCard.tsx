export function SkeletonCard() {
  return (
    <div className="animate-pulse border-t border-ink/20 pt-4">
      <div className="h-3 w-24 bg-ink/10" />
      <div className="mt-4 grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-5 sm:gap-6">
        <div className="aspect-[3/4] w-full bg-paper-deep" />
        <div className="flex flex-col gap-3">
          <div className="h-3 w-20 bg-ink/10" />
          <div className="h-7 w-4/5 bg-ink/10" />
          <div className="h-3 w-2/5 bg-ink/10" />
          <div className="mt-4 h-3 w-full bg-ink/10" />
          <div className="h-3 w-11/12 bg-ink/10" />
          <div className="h-3 w-3/4 bg-ink/10" />
        </div>
      </div>
    </div>
  );
}
