'use client'

import { Search, Bell, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'

export function Header() {
  const { user, logout } = useAuth()

  // cierra sesion y limpia todo el almacenamiento del navegador
  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    logout()
  }

  const nombreCompleto = user ? `${user.nombres} ${user.apellidos}` : 'Usuario'
  const rolDisplay = user?.rol || ''

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm h-16 flex items-center justify-between px-4 lg:px-8 gap-4">
      {/* Buscador global */}
      <div className="hidden lg:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar expedientes..."
            className="pl-10 bg-background/50 border-border focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Spacer para desktop */}
      <div className="flex-1 hidden lg:block"></div>

      {/* Notificaciones y Perfil */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-background/50"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-background/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium">{nombreCompleto}</span>
                <span className="text-xs text-muted-foreground capitalize">{rolDisplay.toLowerCase()}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
