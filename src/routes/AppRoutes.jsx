import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Users from '../pages/Users.jsx'
import Clients from '../pages/Clients.jsx'
import ClientDetail from '../pages/ClientDetail.jsx'
import Documents from '../pages/Documents.jsx'
import Profile from '../pages/Profile.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
