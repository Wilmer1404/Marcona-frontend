'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Inbox,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    label: 'Mi Bandeja',
    icon: Inbox,
    href: '/dashboard',
  },
  {
    label: 'Nuevo Expediente',
    icon: FileText,
    href: '/dashboard/nuevo-expediente',
  },
  {
    label: 'Seguimiento',
    icon: BarChart3,
    href: '/dashboard/seguimiento',
  },
  {
    label: 'Reportes',
    icon: BarChart3,
    href: '/dashboard/reportes',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Toggle button para mobile */}
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
          'fixed left-0 top-0 z-30 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out',
          isOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span className="hidden sm:inline">SGD</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Configuración</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Salir</span>
          </Button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
