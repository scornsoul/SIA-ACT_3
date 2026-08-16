import { useNavigate } from 'react-router-dom'

function TopBar() {
  const navigate = useNavigate()

  function handleLogout() {
    // TODO: clear real auth session once login is wired to a backend
    navigate('/login')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-white px-6 shadow-sm">
      <span className="text-lg font-semibold text-gray-900">
        🐜 Pest Control Admin
      </span>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">👤 Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopBar
