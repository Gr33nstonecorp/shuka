export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero / Header Skeleton */}
        <div className="h-12 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mb-8" />

        {/* Main Content Skeleton */}
        <div className="grid gap-8">
          {/* Form / Input Skeleton */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse" />
            <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl mt-8 animate-pulse" />
          </div>

          {/* Results Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse" />
                <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />
                <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
