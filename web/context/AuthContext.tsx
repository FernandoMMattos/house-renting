"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../lib/auth";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = await apiLogin(email, password);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const user = await apiRegister(name, email, password);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    apiLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
