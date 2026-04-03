export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Skeleton */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="h-8 w-80 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse mb-8" />
            <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse mb-6" />
            <div className="h-20 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse mb-12" />
            <div className="flex gap-4">
              <div className="h-14 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              <div className="h-14 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="h-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse" />
        </div>

        {/* Workspace Skeleton */}
        <div className="mb-12">
          <div className="h-12 w-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse mb-4" />
          <div className="h-6 w-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
