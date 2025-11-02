import React from 'react'
import { UserContext } from '@/context/userContext'
import { useContext } from 'react'
function EngineerDashboard() {
    const{user,loading } = useContext(UserContext);
  return (
    <div>
        <h1>Engineer Dashboard</h1>
        <h2>{user.name}</h2>
        <h2>{user.email}</h2>
        <h2>{user.role}</h2>
    </div>
  )
}

export default EngineerDashboard