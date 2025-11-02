import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import UserProvider from "./context/userContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Unauthorized from "./pages/Unauthorized";
import UserDashboard from "./pages/UserDashboard";
import EngineerDashboard from "./pages/EngineerDashboard";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["admin"]} Children={<AdminDashboard />} />}
          />
          <Route
            path="/user"
            element={<ProtectedRoute allowedRoles={["user"]} Children={<UserDashboard />} />}
          />
           <Route
            path="/engineer"
            element={<ProtectedRoute allowedRoles={["engineer"]} Children={<EngineerDashboard />} />}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
