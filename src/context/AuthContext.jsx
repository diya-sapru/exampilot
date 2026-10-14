import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("exampilot_user");
        if (saved) {
          setUser(JSON.parse(saved));
        }
      }
    } catch {
      // SSR or privacy mode fallback
    }
  }, []);

  function login(userData) {
    setUser(userData);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("exampilot_user", JSON.stringify(userData));
      }
    } catch {
      // fallback
    }
  }

  function logout() {
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("exampilot_user");
      }
    } catch {
      // fallback
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      isLoggedIn: false,
    };
  }
  return context;
}
