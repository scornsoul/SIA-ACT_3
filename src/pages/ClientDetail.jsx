import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../components/common/Modal.jsx'
import { useClients } from '../context/ClientsContext.jsx'

const CLASSIFICATIONS = ['Residential', 'Commercial', 'Industrial']
const SOURCES = ['Walk-in', 'Referral']
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { clients, updateClient, deleteClient, addDocument, deleteDocument } = useClients()
  const fileInputRef = useRef(null)

  const client = clients.find((c) => c.id === Number(id))

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [editError, setEditError] = useState('')
  const [uploadError, setUploadError] = useState('')

  if (!client) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-gray-500">Client not found.</p>
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Clients
        </button>
      </div>
    )
  }

  function openEditModal() {
    setEditForm({
      name: client.name,
      classification: client.classification,
      source: client.source,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes,
    })
    setEditError('')
    setIsEditOpen(true)
  }

  function handleEditChange(e) {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleEditSubmit(e) {
    e.preventDefault()

    if (!editForm.name || !editForm.phone) {
      setEditError('Client name and phone are required.')
      return
    }

    setEditError('')
    // TODO: wire to api/clients.js once the backend + Postgres are ready
    updateClient(client.id, editForm)
    setIsEditOpen(false)
  }

  function handleDeleteClient() {
    if (!window.confirm(`Delete ${client.name}? This cannot be undone.`)) return
    // TODO: wire to api/clients.js once the backend + Postgres are ready
    deleteClient(client.id)
    navigate('/clients')
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Only PDF, JPG, or PNG files are allowed.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File must be 10 MB or smaller.')
      return
    }

    setUploadError('')
    // TODO: wire to api/documents.js once the backend + Postgres are ready
    addDocument(client.id, file)
  }

  function handleDeleteDocument(docId) {
    if (!window.confirm('Delete this document?')) return
    deleteDocument(client.id, docId)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">🏢 Client Details</h1>
      <div className="mt-3 border-b border-gray-200" />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          ← Back to Clients
        </button>
        <button
          type="button"
          onClick={openEditModal}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={handleDeleteClient}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          🗑️ Delete
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-white p-6 shadow-md">
        <dl className="space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Name:</dt>
            <dd className="text-gray-900">{client.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Type:</dt>
            <dd className="text-gray-900">{client.classification}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Source:</dt>
            <dd className="text-gray-900">{client.source || '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Phone:</dt>
            <dd className="text-gray-900">{client.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Email:</dt>
            <dd className="text-gray-900">{client.email || '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Address:</dt>
            <dd className="text-gray-900">{client.address || '—'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-500">Notes:</dt>
            <dd className="text-gray-900">{client.notes || '—'}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mt-6 text-lg font-semibold text-gray-900">📄 Documents</h2>

      <div className="mt-2 rounded-xl bg-white p-6 shadow-md">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleUploadClick}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Upload Document
        </button>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-500">
              <tr>
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {client.documents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No documents uploaded yet.
                  </td>
                </tr>
              )}
              {client.documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-2 pr-4 text-gray-900">{doc.name}</td>
                  <td className="py-2 pr-4 text-gray-500">{doc.size}</td>
                  <td className="py-2 pr-4 text-gray-500">{doc.uploadedAt}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-3 text-base">
                      {doc.url ? (
                        <a href={doc.url} download={doc.name} title="Download">
                          📥
                        </a>
                      ) : (
                        <span title="No file attached (seed data)" className="opacity-30">
                          📥
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete"
                        className="hover:opacity-70"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="✏️ Edit Client">
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="edit-name"
                name="name"
                type="text"
                value={editForm.name}
                onChange={handleEditChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="edit-classification" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="edit-classification"
                name="classification"
                value={editForm.classification}
                onChange={handleEditChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CLASSIFICATIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                id="edit-source"
                name="source"
                value={editForm.source}
                onChange={handleEditChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="edit-phone"
                name="phone"
                type="text"
                value={editForm.phone}
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
              <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="edit-address"
                name="address"
                type="text"
                value={editForm.address}
                onChange={handleEditChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="edit-notes"
                name="notes"
                rows={3}
                value={editForm.notes}
                onChange={handleEditChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {editError && <p className="text-sm text-red-600">{editError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
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
        )}
      </Modal>
    </div>
  )
}

export default ClientDetail
