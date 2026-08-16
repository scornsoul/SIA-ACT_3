import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👤' },
  { to: '/clients', label: 'Clients', icon: '🏢' },
  { to: '/documents', label: 'Documents', icon: '📄' },
  { to: '/profile', label: 'Profile', icon: '⚙️' },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 top-16 z-10 w-60 overflow-y-auto bg-white shadow-sm">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
