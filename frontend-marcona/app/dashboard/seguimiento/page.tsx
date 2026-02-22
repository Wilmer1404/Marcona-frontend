import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Seguimiento - SGD Marcona',
  description: 'Seguimiento de expedientes',
}

export default function SeguimientoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seguimiento de Expedientes</h1>
        <p className="text-muted-foreground mt-1">
          Monitorea el progreso y estado de tus expedientes
        </p>
      </div>

      <Card className="border border-border p-12 text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Módulo de Seguimiento
        </p>
        <p className="text-muted-foreground">
          Próximamente: Gráficos, filtros y análisis de expedientes
        </p>
      </Card>
    </div>
  )
}
