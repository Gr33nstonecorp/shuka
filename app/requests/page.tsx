export default function RequestsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-7xl mb-8">📋</div>
        <h1 className="text-5xl font-black tracking-tighter mb-6">Requests</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-lg mx-auto">
          Create and manage your purchasing requests. Add items, set quantities, and send them to vendors for quotes.
        </p>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 max-w-md mx-auto">
          <p className="text-lg font-medium mb-4">This feature is coming soon</p>
          <p className="text-zinc-500 dark:text-zinc-400">
            You’ll be able to create structured requests, attach files, and track their status here.
          </p>
        </div>

        <div className="mt-12">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Homepage</a>
        </div>
      </div>
    </main>
  );
}
