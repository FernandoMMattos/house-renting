"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiRegister, apiLogout } from "../lib/auth";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const COOKIE_OPTS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password);
    Cookies.set("token", token, COOKIE_OPTS);
    Cookies.set("user", JSON.stringify(user), COOKIE_OPTS);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    await apiRegister(name, email, password);
  };

  const logout = async () => {
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
    await apiLogout().catch((err) => {
      console.error(err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
