/** Shimmering placeholder card used while projects load. */
export default function CardSkeleton() {
  return (
    <div className="h-[300px] animate-pulse rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 h-5 w-3/4 rounded-md bg-secondary" />
      <div className="mb-2 h-3 w-full rounded bg-secondary" />
      <div className="mb-6 h-3 w-5/6 rounded bg-secondary" />
      <div className="mb-2 h-2.5 w-full rounded-full bg-secondary" />
      <div className="mt-8 flex justify-between">
        <div className="h-10 w-20 rounded bg-secondary" />
        <div className="h-10 w-20 rounded bg-secondary" />
      </div>
    </div>
  );
}
