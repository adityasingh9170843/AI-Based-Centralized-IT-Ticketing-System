import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/profile`,
          { withCredentials: true } 
        );
        console.log("context data",response.data);
        setUser(response.data);
      } catch (err) {
        console.log("User not authenticated", err);
        clearUser();
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
      await axios.post(`http://localhost:5000/api/auth/logout`,{},{ withCredentials: true });
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