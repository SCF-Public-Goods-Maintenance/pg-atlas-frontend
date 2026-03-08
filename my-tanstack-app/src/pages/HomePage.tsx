export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to PGAtlas</h2>
        <p className="mt-1 text-gray-600">
          Your dashboard overview. Use the sidebar to navigate.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Overview</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">—</p>
          <p className="mt-1 text-sm text-gray-600">Placeholder metric</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Activity</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">—</p>
          <p className="mt-1 text-sm text-gray-600">Placeholder metric</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900">—</p>
          <p className="mt-1 text-sm text-gray-600">Placeholder metric</p>
        </div>
      </div>
    </div>
  )
}
