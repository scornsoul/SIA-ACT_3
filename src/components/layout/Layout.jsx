import { Outlet } from 'react-router-dom'
import TopBar from './TopBar.jsx'
import Sidebar from './Sidebar.jsx'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Sidebar />
      <main className="ml-60 pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
