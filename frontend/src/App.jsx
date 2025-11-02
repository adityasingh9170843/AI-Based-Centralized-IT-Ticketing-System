import AdminDashboard from "./pages/AdminDashboard"
import UserProvider from "./context/userContext"
function App() {
  
  return (
    <UserProvider>
      <AdminDashboard />
   </UserProvider>
  )
}

export default App
