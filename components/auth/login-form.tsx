'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // <-- Importante para redirigir en Next.js
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context' // <-- Traemos nuestro "cerebro" de autenticación

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth() // Extraemos la función real que conecta al backend
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    
    try {
      // Llamada REAL a nuestra API de Node.js + PostgreSQL
      const result = await login(email, password)

      if (result.success) {
        toast.success('¡Bienvenido al sistema!')
        router.push('/dashboard') // Nos vamos al panel principal
      } else {
        // Si el backend responde con error (ej. contraseña incorrecta)
        toast.error(result.mensaje || 'Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Correo Electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="jrodriguez@marcona.gob.pe" // Un guiño a nuestro usuario de prueba
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        {isLoading ? 'Conectando...' : 'Ingresar'}
      </Button>
    </form>
  )
}