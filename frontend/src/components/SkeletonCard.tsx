export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-zinc-200 bg-zinc-50 p-5">
      <div className="mx-auto h-6 w-2/3 rounded bg-zinc-200" />
      <div className="mx-auto mt-4 h-4 w-1/2 rounded bg-zinc-200" />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="aspect-[3/4] w-full rounded bg-zinc-200" />
        <div className="flex flex-col gap-2">
          <div className="h-8 w-full rounded bg-zinc-200" />
          <div className="h-8 w-full rounded bg-zinc-200" />
          <div className="h-8 w-full rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}
