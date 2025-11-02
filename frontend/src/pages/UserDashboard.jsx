import React, { useContext } from 'react'

import { UserContext } from '@/context/userContext'
function UserDashboard() {
    const {user,loading } = useContext(UserContext);
  return (
    <div>
        <h1>User Dashboard</h1>
        <h2>{user.name}</h2>
        <h2>{user.email}</h2>
        <h2>{user.role}</h2>
    </div>
    
  )
}

export default UserDashboard