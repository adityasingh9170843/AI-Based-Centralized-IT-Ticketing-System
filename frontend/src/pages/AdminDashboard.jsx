import React from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'
import TicketsPage from '@/components/TicketsPage'
import EngineersPage from '@/components/EngineersPage'
import { useState } from 'react'
import DepartmentsPage from '@/components/DepartmentsPage'
function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const renderPage = () => {
    switch (currentPage) {
      case "engineers":
        return <EngineersPage />
      case "tickets":
        return <TicketsPage />
      case "departments":
        return <DepartmentsPage/>
      default:
        return <Dashboard />
    }
  }
  return (
    <div className="flex h-screen text-foreground">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-primary)/12,transparent)]" />
          <div className="relative">{renderPage()}</div>
        </main>
      </div>
    </div>
  )
}


export default AdminDashboard