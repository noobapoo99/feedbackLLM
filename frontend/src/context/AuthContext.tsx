import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { API } from "../utils/api";
import { socket } from "../utils/socket";

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
    const res = await API.post("/auth/login", { email, password });

    const token = res.data.token;
    localStorage.setItem("token", token);

    const me = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(me.data);
    localStorage.setItem("user", JSON.stringify(me.data));

    // 🔑 update socket auth + connect
    socket.auth = { token };
    socket.connect();
  };

  const logout = () => {
    socket.disconnect();
    socket.auth = {};

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
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

      socket.auth = { token };
      socket.connect();
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
