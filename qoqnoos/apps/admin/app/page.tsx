export default function AdminDashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Qoqnoos Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold text-gray-600">Total Users</h2><p className="text-4xl font-bold mt-2">&mdash;</p></div>
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold text-gray-600">Active Subscriptions</h2><p className="text-4xl font-bold mt-2">&mdash;</p></div>
        <div className="bg-white rounded-lg shadow p-6"><h2 className="text-lg font-semibold text-gray-600">AI Sessions Today</h2><p className="text-4xl font-bold mt-2">&mdash;</p></div>
      </div>
    </main>
  );
}
