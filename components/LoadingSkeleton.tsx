export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Skeleton */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse mb-6" />
            <div className="h-16 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mb-6" />
            <div className="h-16 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mb-10" />
            <div className="flex gap-4">
              <div className="h-14 w-52 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              <div className="h-14 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 h-80 animate-pulse" />
        </div>

        {/* Workspace Skeleton */}
        <div className="mb-8">
          <div className="h-12 w-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mb-4" />
          <div className="h-6 w-96 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
