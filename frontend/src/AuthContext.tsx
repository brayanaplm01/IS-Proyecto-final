"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import LoginModal from "@/components/ui/LoginModal";
import { useCartStore } from "@/store/cartStore";

interface User {
  id_usuario: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  correo: string;
  telefono?: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  onLoginClick: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Cargar token y usuario del localStorage si existen
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
  };

  const onLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, onLoginClick }}>
      {children}
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}; 