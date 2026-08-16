import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClientsProvider } from './context/ClientsContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClientsProvider>
        <App />
      </ClientsProvider>
    </BrowserRouter>
  </StrictMode>,
)
