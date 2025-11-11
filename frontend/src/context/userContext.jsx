import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config/api";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/profile`,
          { withCredentials: true } 
        );
        console.log("context data",response.data);
        setUser(response.data);
      } catch (err) {
        // Try engineer session if user session is not available
        try {
          const engRes = await axios.get(`${API_URL}/api/engineer/me`, { withCredentials: true });
          setUser(engRes.data);
        } catch (e2) {
          console.log("No active session", e2);
          clearUser();
        }
      } finally {
        setLoading(false);
        
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  const logout = async () => {
    try {
      // Attempt both user and engineer logouts; ignore errors
      await axios.post(`${API_URL}/api/auth/logout`,{},{ withCredentials: true }).catch(() => {});
      await axios.post(`${API_URL}/api/engineer/logout`,{},{ withCredentials: true }).catch(() => {});
      clearUser();
    } catch (err) {
      console.log("Logout failed", err);
    }
  };


  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser,logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;