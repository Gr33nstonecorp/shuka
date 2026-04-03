export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-7xl mb-8">📦</div>
        <h1 className="text-5xl font-black tracking-tighter mb-6">Orders</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-lg mx-auto">
          Track all your approved and active orders. Monitor delivery status, payments, and receipts.
        </p>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 max-w-md mx-auto">
          <p className="text-lg font-medium mb-4">Coming soon</p>
          <p className="text-zinc-500 dark:text-zinc-400">
            Full order tracking, status updates, and delivery notifications will be available here.
          </p>
        </div>

        <div className="mt-12">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Homepage</a>
        </div>
      </div>
    </main>
  );
}
