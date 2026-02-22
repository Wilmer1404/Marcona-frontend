"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api/axios";

// 1. Interfaz que refleja EXACTAMENTE tu tabla "usuarios" de PostgreSQL
interface User {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  correo: string;
  departamento_id: number;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<{ success: boolean; mensaje?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (correo: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { correo, password });
      
      if (response.data.exito) {
        const { token, usuario } = response.data;
        
        // NORMALIZACIÓN: Garantizamos que 'id' y 'departamento_id' existan siempre
        const usuarioSeguro: User = {
          ...usuario,
          id: usuario.id || usuario.id_usuario,
          departamento_id: usuario.departamento_id || usuario.id_departamento
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(usuarioSeguro));
        setUser(usuarioSeguro);
        
        return { success: true };
      }
      return { success: false, mensaje: response.data.mensaje };
    } catch (error: any) {
      return { 
        success: false, 
        mensaje: error.response?.data?.mensaje || "Error de conexión con el servidor" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}