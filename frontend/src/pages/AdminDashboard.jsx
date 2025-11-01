import React from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'
import TicketsPage from '@/components/TicketsPage'
import EngineersPage from '@/components/EngineersPage'
import { useState } from 'react'
function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const renderPage = () => {
    switch (currentPage) {
      case "engineers":
        return <EngineersPage />
      case "tickets":
        return <TicketsPage />
      default:
        return <Dashboard />
    }
  }
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto bg-background relative">{renderPage()}</main>
      </div>
    </div>
  )
}


export default AdminDashboard