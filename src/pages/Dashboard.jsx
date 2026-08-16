const stats = [
  { label: 'Total Users', value: 12, icon: '👤' },
  { label: 'Active Users', value: 9, icon: '✅' },
  { label: 'Clients', value: 45, icon: '🏢' },
  { label: 'Documents', value: 23, icon: '📄' },
]

const recentUsers = [
  { name: 'John', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane', email: 'jane@example.com', role: 'Staff', status: 'Active' },
  { name: 'Bob', email: 'bob@example.com', role: 'Staff', status: 'Active' },
]

function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">📊 Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of system activity.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            📋 Recent Users
          </h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-2">Name</th>
              <th className="px-5 py-2">Email</th>
              <th className="px-5 py-2">Role</th>
              <th className="px-5 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <tr key={user.email}>
                <td className="px-5 py-3 text-gray-900">{user.name}</td>
                <td className="px-5 py-3 text-gray-500">{user.email}</td>
                <td className="px-5 py-3 text-gray-500">{user.role}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
