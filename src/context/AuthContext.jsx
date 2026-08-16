import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USER_KEY = "authUser";

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (data) => {
    setUserState(data);
    if (data) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const clearUser = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
