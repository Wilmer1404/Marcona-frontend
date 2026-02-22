import { File, ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExpedientTimeline } from '@/components/dashboard/expedient-timeline'

export const metadata = {
  title: 'Detalle Expediente - SGD Marcona',
  description: 'Ver detalles y trazabilidad del expediente',
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ExpedientDetailPage({ params }: PageProps) {
  const { id } = await params

  // Mock data
  const expedient = {
    id,
    codigo: 'EXP-2024-001',
    asunto: 'Solicitud de Licencia Municipal',
    tipo: 'Solicitud',
    origen: 'Gerencia de Comercio',
    departamento: 'Gerencia de Obras',
    fecha: '21/02/2024',
    estado: 'revision',
    prioridad: 'normal',
    solicitante: 'Juan Pérez García',
    descripcion:
      'Solicitud formal para obtención de licencia municipal de funcionamiento para local comercial.',
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="gap-2 text-primary hover:bg-primary/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mi Bandeja
          </Button>
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{expedient.asunto}</h1>
            <p className="text-muted-foreground mt-1">{expedient.codigo}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border">
              <Download className="h-4 w-4" />
              Descargar
            </Button>
            <Button variant="outline" className="gap-2 border-border">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Visor de documento */}
        <div className="lg:col-span-2 space-y-4">
          {/* Visor PDF simulado */}
          <Card className="border border-border p-6 aspect-video bg-muted/30 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4">
              <File className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-foreground font-medium">
                  Archivo: {expedient.codigo}.pdf
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visor de PDF integrado
                </p>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4" />
                Ver Documento Completo
              </Button>
            </div>
          </Card>

          {/* Detalles del expediente */}
          <Card className="border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Información General</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Tipo
                </p>
                <p className="text-foreground font-medium mt-1">{expedient.tipo}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Prioridad
                </p>
                <div className="mt-1">
                  <Badge
                    className={
                      expedient.prioridad === 'alta'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }
                  >
                    {expedient.prioridad === 'alta' ? 'Alta' : 'Normal'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Origen
                </p>
                <p className="text-foreground font-medium mt-1">{expedient.origen}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Destino
                </p>
                <p className="text-foreground font-medium mt-1">
                  {expedient.departamento}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Solicitante
                </p>
                <p className="text-foreground font-medium mt-1">
                  {expedient.solicitante}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Fecha Creación
                </p>
                <p className="text-foreground font-medium mt-1">{expedient.fecha}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Descripción
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                {expedient.descripcion}
              </p>
            </div>
          </Card>
        </div>

        {/* Columna derecha - Estado */}
        <div className="space-y-4">
          <Card className="border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Estado Actual</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Estatus
                </p>
                <Badge
                  className={
                    expedient.estado === 'revision'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0 text-sm font-medium mt-2'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0 text-sm font-medium mt-2'
                  }
                >
                  {expedient.estado === 'revision'
                    ? 'En Revisión'
                    : 'Finalizado'}
                </Badge>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Agregar Comentario
                </Button>
                <Button variant="outline" className="w-full gap-2 border-border">
                  Ver Historial Completo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Historial de Movimientos
        </h2>
        <ExpedientTimeline />
      </div>
    </div>
  )
}
