import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Create context
export const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {

  // 3. State to store user
  const [user, setUser] = useState(null);

  // 4. State for loading
  const [loading, setLoading] = useState(true);

  // 5. Function to fetch user using token
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Auth Error:", err);
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };
  // 6. Run loadUser when app starts
  useEffect(() => {
    loadUser();
  }, []);
  // 7. Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  // 8. Provide values globally
  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};