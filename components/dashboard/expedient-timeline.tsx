'use client'

import { CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  type: 'created' | 'moved' | 'reviewed' | 'commented'
  title: string
  description: string
  actor: string
  department: string
  timestamp: string
  comment?: string
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'created',
    title: 'Expediente Creado',
    description: 'Se creó el expediente inicial',
    actor: 'Juan Pérez',
    department: 'Gerencia de Comercio',
    timestamp: '21/02/2024 - 10:30 AM',
  },
  {
    id: '2',
    type: 'moved',
    title: 'Derivado a Revisión',
    description: 'Documento enviado para revisión inicial',
    actor: 'Admin Sistema',
    department: 'Gerencia de Obras',
    timestamp: '21/02/2024 - 11:15 AM',
  },
  {
    id: '3',
    type: 'reviewed',
    title: 'En Revisión',
    description: 'Revisión técnica del documento',
    actor: 'María González',
    department: 'Gerencia de Obras',
    timestamp: '21/02/2024 - 14:45 PM',
    comment: 'Se requieren ajustes en la documentación técnica',
  },
  {
    id: '4',
    type: 'commented',
    title: 'Comentario Agregado',
    description: 'Se agregó un comentario al expediente',
    actor: 'Carlos López',
    department: 'Gerencia Legal',
    timestamp: '21/02/2024 - 16:20 PM',
    comment: 'Aprobado legalmente. Proceder con trámite administrativo',
  },
]

const typeConfig = {
  created: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100/10 dark:bg-green-900/20',
  },
  moved: {
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  reviewed: {
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100/10 dark:bg-blue-900/20',
  },
  commented: {
    icon: MessageSquare,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100/10 dark:bg-purple-900/20',
  },
}

export function ExpedientTimeline() {
  return (
    <div className="space-y-4">
      {mockEvents.map((event, index) => {
        const config = typeConfig[event.type]
        const Icon = config.icon

        return (
          <div key={event.id} className="flex gap-4">
            {/* Línea vertical y punto */}
            <div className="flex flex-col items-center">
              <div className={cn('p-3 rounded-full', config.bgColor)}>
                <Icon className={cn('h-5 w-5', config.color)} />
              </div>
              {index < mockEvents.length - 1 && (
                <div className="w-1 h-12 bg-border mt-2"></div>
              )}
            </div>

            {/* Contenido */}
            <Card className="flex-1 p-4 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-border text-xs">
                    {event.actor}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                    {event.department}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{event.timestamp}</p>
              </div>

              {event.comment && (
                <div className="p-3 bg-muted/50 rounded-md border-l-2 border-primary">
                  <p className="text-sm text-foreground italic">"{event.comment}"</p>
                </div>
              )}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
