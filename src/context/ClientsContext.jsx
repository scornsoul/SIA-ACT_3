import { createContext, useContext, useState } from 'react'

const ClientsContext = createContext(null)

const initialClients = [
  {
    id: 1,
    name: 'ABC Pest Control',
    classification: 'Residential',
    source: 'Walk-in',
    phone: '123-456-7890',
    email: 'abc@example.com',
    address: '123 Main St, City',
    notes: 'Regular customer, monthly service',
    documents: [
      { id: 1, name: 'Contract.pdf', size: '2.3 MB', uploadedAt: '2026-08-15', url: null },
      { id: 2, name: 'Inspection.jpg', size: '1.1 MB', uploadedAt: '2026-08-14', url: null },
      { id: 3, name: 'Agreement.docx', size: '0.5 MB', uploadedAt: '2026-08-13', url: null },
    ],
  },
]

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState(initialClients)

  function addClient(data) {
    setClients((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1,
        documents: [],
        ...data,
      },
    ])
  }

  function updateClient(id, data) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }

  function deleteClient(id) {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  function addDocument(clientId, file) {
    const doc = {
      id: Date.now(),
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString().slice(0, 10),
      url: URL.createObjectURL(file),
    }
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, documents: [...c.documents, doc] } : c,
      ),
    )
  }

  function deleteDocument(clientId, docId) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c
        const doc = c.documents.find((d) => d.id === docId)
        if (doc?.url) URL.revokeObjectURL(doc.url)
        return { ...c, documents: c.documents.filter((d) => d.id !== docId) }
      }),
    )
  }

  return (
    <ClientsContext.Provider
      value={{ clients, addClient, updateClient, deleteClient, addDocument, deleteDocument }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within a ClientsProvider')
  return ctx
}
