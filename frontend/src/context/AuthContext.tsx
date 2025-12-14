import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { API } from "../utils/api";
import { closeSocket, initSocket } from "../utils/socket";

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
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);

    const me = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(me.data);
    localStorage.setItem("user", JSON.stringify(me.data));
    initSocket();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ⭐ clear user
    setUser(null);
    closeSocket();
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");

    // ⭐ If user already stored in localStorage, load it immediately
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    if (!token) return;

    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
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
