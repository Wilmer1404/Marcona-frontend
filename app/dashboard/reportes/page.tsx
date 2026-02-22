import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Reportes - SGD Marcona',
  description: 'Reportes del sistema',
}

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
        <p className="text-muted-foreground mt-1">
          Genera y descarga reportes detallados del sistema
        </p>
      </div>

      <Card className="border border-border p-12 text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Módulo de Reportes
        </p>
        <p className="text-muted-foreground">
          Próximamente: Reportes estadísticos, análisis de desempeño y exportación de datos
        </p>
      </Card>
    </div>
  )
}
