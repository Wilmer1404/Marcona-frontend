import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Ingresar - SGD Marcona',
  description: 'Inicia sesión en el Sistema de Gestión Documental',
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Patrón geométrico de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 mb-4">
            <div className="w-8 h-8 bg-primary rounded-md"></div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SGD Marcona</h1>
          <p className="text-muted-foreground text-sm">
            Sistema de Gestión Documental Municipal
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-xl p-8 dark:bg-card/50">
          <h2 className="text-xl font-semibold text-foreground mb-6">Inicia sesión</h2>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Municipalidad de Marcona. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
