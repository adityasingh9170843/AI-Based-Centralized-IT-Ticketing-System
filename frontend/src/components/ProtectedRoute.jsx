import { Navigate } from "react-router-dom";
import { UserContext } from "@/context/userContext";
import {useContext } from "react";
import Unauthorized from "@/pages/Unauthorized";
const ProtectedRoute = ({Children,allowedRoles}) =>{

    const {user,loading } = useContext(UserContext);
    if(loading) return <div>loading...</div>
    if(!user) return <Navigate to="/login" />
    if(!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" element={<Unauthorized />} />
    return Children
}

export default ProtectedRoute