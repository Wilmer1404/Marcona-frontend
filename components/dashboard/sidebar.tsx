'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Inbox, FileText, Search, BarChart3, Shield, LogOut, Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

const baseItems = [
  { label: 'Mi Bandeja',         icon: Inbox,     href: '/dashboard' },
  { label: 'Nuevo Expediente',   icon: FileText,  href: '/dashboard/nuevo-expediente' },
  { label: 'Seguimiento',        icon: Search,    href: '/dashboard/seguimiento' },
  { label: 'Reportes',           icon: BarChart3, href: '/dashboard/reportes' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const { logout, user } = useAuth()

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    logout()
  }

  // el link de admin solo se muestra a usuarios con rol ADMIN
  const menuItems = user?.rol === 'ADMIN'
    ? [...baseItems, { label: 'Administración', icon: Shield, href: '/dashboard/admin' }]
    : baseItems

  return (
    <>
      {/* Toggle mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-40 lg:hidden bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-30 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col',
          isOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-6 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span className="hidden sm:inline">SGD</span>
          </Link>
        </div>

        {/* Nombre del usuario */}
        {user && (
          <div className="px-5 py-3 border-b border-sidebar-border flex-shrink-0">
            <p className="text-xs text-sidebar-foreground/60 font-medium uppercase">Sesión</p>
            <p className="text-sm font-semibold text-sidebar-foreground truncate mt-0.5">
              {user.nombres} {user.apellidos}
            </p>
            <p className="text-xs text-sidebar-foreground/50 mt-0.5">{user.rol}</p>
          </div>
        )}

        {/* Menú */}
        <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            const isAdmin = item.href === '/dashboard/admin'

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? isAdmin
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : isAdmin
                      ? 'text-red-400/80 hover:bg-red-500/10 hover:text-red-400'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </Button>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
