"use client"; // Muy importante en Next.js para usar useState y useEffect

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api/axios"; // Ajusta la ruta si es necesario

// Definimos la forma de nuestros datos (TypeScript)
interface User {
  id: number;
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

  // Al recargar la página, verificamos si ya había un usuario guardado
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
      // Llamamos a nuestro backend en Node.js
      const response = await api.post("/auth/login", { correo, password });
      
      if (response.data.exito) {
        const { token, usuario } = response.data;
        // Guardamos en el navegador
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(usuario));
        setUser(usuario);
        return { success: true };
      }
      return { success: false, mensaje: response.data.mensaje };
    } catch (error: any) {
      console.error("Error en login:", error);
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
    // Redirigir al login usando window.location para forzar limpieza de estado
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading ? children : null} {/* Evitamos parpadeos mientras carga */}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar este contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}