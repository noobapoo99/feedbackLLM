import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await axios.post("http://localhost:5001/auth/login", {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);

    const me = await axios.get("http://localhost:5001/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5001/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
