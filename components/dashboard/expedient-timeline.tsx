'use client'

import { CheckCircle, Clock, MessageSquare, ArrowRight, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface MovimientoHistorial {
  id: number
  accion: string
  descripcion: string
  fecha_movimiento: string
  usuario: string
  departamento: string
  siglas: string
}

// icono y color segun la accion real del schema
const getConfig = (accion: string) => {
  switch (accion) {
    case 'CREADO':
      return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100/20 dark:bg-green-900/20', label: 'Expediente Creado' }
    case 'DERIVADO':
      return { icon: ArrowRight, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100/20 dark:bg-blue-900/20', label: 'Derivado' }
    case 'DOCUMENTO_AGREGADO':
      return { icon: FileText, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100/20 dark:bg-purple-900/20', label: 'Documento Agregado' }
    case 'ESTADO_ACTUALIZADO':
      return { icon: Clock, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100/20 dark:bg-orange-900/20', label: 'Estado Actualizado' }
    case 'FINALIZADO':
      return { icon: CheckCircle, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Finalizado' }
    default:
      return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted/20', label: accion }
  }
}

interface Props {
  historial: MovimientoHistorial[]
}

export function ExpedientTimeline({ historial }: Props) {
  if (!historial || historial.length === 0) {
    return (
      <Card className="p-8 text-center border border-border">
        <p className="text-muted-foreground">No hay movimientos registrados para este expediente.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {historial.map((mov, index) => {
        const config = getConfig(mov.accion)
        const Icon = config.icon
        const fecha = new Date(mov.fecha_movimiento)
        const fechaFormato = fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        const horaFormato = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

        return (
          <div key={mov.id} className="flex gap-4">
            {/* punto + línea vertical */}
            <div className="flex flex-col items-center">
              <div className={cn('p-3 rounded-full', config.bgColor)}>
                <Icon className={cn('h-5 w-5', config.color)} />
              </div>
              {index < historial.length - 1 && (
                <div className="w-1 h-12 bg-border mt-2" />
              )}
            </div>

            {/* tarjeta del movimiento */}
            <Card className="flex-1 p-4 border border-border hover:shadow-md transition-shadow mb-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{config.label}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {fechaFormato} — {horaFormato}
                </span>
              </div>

              <p className="text-sm text-foreground mb-3">{mov.descripcion}</p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-border text-xs">
                  {mov.usuario || 'Sistema'}
                </Badge>
                {mov.departamento && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                    {mov.departamento} {mov.siglas ? `(${mov.siglas})` : ''}
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
