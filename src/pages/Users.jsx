import { useState, useMemo } from 'react'
import Modal from '../components/common/Modal.jsx'

const ROLES = ['Admin', 'Staff']

const initialUsers = [
  {
    id: 1,
    fullName: 'System Admin',
    email: 'admin@example.com',
    role: 'Admin',
    isActive: true,
    lastLogin: '2026-08-14',
  },
]

const emptyCreateForm = { fullName: '', email: '', password: '', role: ROLES[0] }

function Users() {
  const [users, setUsers] = useState(initialUsers)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(emptyCreateForm)
  const [createError, setCreateError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ fullName: '', email: '', role: ROLES[0] })
  const [editError, setEditError] = useState('')

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  function openCreateModal() {
    setCreateForm(emptyCreateForm)
    setCreateError('')
    setSuccessMessage('')
    setIsCreateOpen(true)
  }

  function handleCreateChange(e) {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleCreateSubmit(e) {
    e.preventDefault()

    if (!createForm.fullName || !createForm.email || !createForm.password) {
      setCreateError('Full name, email, and password are required.')
      return
    }

    if (users.some((u) => u.email.toLowerCase() === createForm.email.toLowerCase())) {
      setCreateError('A user with that email already exists.')
      return
    }

    setCreateError('')
    // TODO: wire to api/users.js once the backend + Postgres are ready
    setUsers((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1,
        fullName: createForm.fullName,
        email: createForm.email,
        role: createForm.role,
        isActive: true,
        lastLogin: 'Never',
      },
    ])
    setSuccessMessage(`Account for ${createForm.fullName} created successfully.`)
    setIsCreateOpen(false)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setEditForm({ fullName: user.fullName, email: user.email, role: user.role })
    setEditError('')
  }

  function handleEditChange(e) {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleEditSubmit(e) {
    e.preventDefault()

    if (!editForm.fullName || !editForm.email) {
      setEditError('Full name and email are required.')
      return
    }

    if (
      users.some(
        (u) =>
          u.id !== editingUser.id &&
          u.email.toLowerCase() === editForm.email.toLowerCase(),
      )
    ) {
      setEditError('A user with that email already exists.')
      return
    }

    // TODO: wire to api/users.js once the backend + Postgres are ready
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, ...editForm } : u)),
    )
    setEditingUser(null)
  }

  function toggleActive(id) {
    // TODO: wire to api/users.js once the backend + Postgres are ready
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    )
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole = roleFilter === 'All' || u.role === roleFilter
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && u.isActive) ||
        (statusFilter === 'Inactive' && !u.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">👤 User Management</h1>
      <div className="mt-3 border-b border-gray-200" />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Create New User
        </button>
        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Search:</label>
          <input
            type="text"
            placeholder="Name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-lg" aria-hidden="true">
            🔍
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No users match your search/filters.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-gray-900">{user.fullName}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-gray-500">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-base">
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      title="Edit"
                      aria-label="Edit user"
                      className="hover:opacity-70"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(user.id)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      aria-label={user.isActive ? 'Deactivate user' : 'Activate user'}
                      className="hover:opacity-70"
                    >
                      {user.isActive ? '🗑️' : '♻️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="✏️ Create New User"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label htmlFor="create-fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="create-fullName"
              name="fullName"
              type="text"
              value={createForm.fullName}
              onChange={handleCreateChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="create-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="create-email"
              name="email"
              type="email"
              value={createForm.email}
              onChange={handleCreateChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="create-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="create-password"
              name="password"
              type="password"
              value={createForm.password}
              onChange={handleCreateChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="create-role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="create-role"
              name="role"
              value={createForm.role}
              onChange={handleCreateChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {createError && <p className="text-sm text-red-600">{createError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="✏️ Edit User"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="edit-fullName"
              name="fullName"
              type="text"
              value={editForm.fullName}
              onChange={handleEditChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="edit-role"
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {editError && <p className="text-sm text-red-600">{editError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Users
