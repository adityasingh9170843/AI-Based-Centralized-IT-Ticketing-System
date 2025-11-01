import React from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={""} onPageChange={""} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
       
      </div>
    </div>
  )
}

export default AdminDashboard