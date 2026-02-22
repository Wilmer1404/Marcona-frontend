import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExpedientsTable } from '@/components/dashboard/expedients-table'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between lg:flex-row lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Bandeja</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus expedientes y documentos
          </p>
        </div>
        <Link href="/dashboard/nuevo-expediente">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Nuevo Expediente
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Expedientes
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">12</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                3
              </p>
            </div>
            <div className="p-3 bg-yellow-100/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                En Revisión
              </p>
              <p className="text-2xl font-bold text-primary mt-2">4</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Finalizados
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                5
              </p>
            </div>
            <div className="p-3 bg-green-100/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de Expedientes */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Expedientes Recientes
        </h2>
        <ExpedientsTable />
      </div>
    </div>
  )
}
