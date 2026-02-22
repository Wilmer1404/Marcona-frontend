'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotificationDemo() {
  const handleSuccess = () => {
    toast.success('Operación completada exitosamente', {
      description: 'El expediente fue creado correctamente',
    })
  }

  const handleError = () => {
    toast.error('Error en la operación', {
      description: 'Por favor intenta nuevamente más tarde',
    })
  }

  const handleInfo = () => {
    toast.info('Información importante', {
      description: 'Tu sesión expirará en 10 minutos',
    })
  }

  const handleWarning = () => {
    toast.warning('Advertencia', {
      description: 'Este cambio no se puede deshacer',
    })
  }

  return (
    <Card className="p-6 border border-border space-y-4">
      <h3 className="font-semibold text-foreground">Sistema de Notificaciones</h3>
      <p className="text-sm text-muted-foreground">
        Las notificaciones aparecen en la esquina superior derecha
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleSuccess}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          Éxito
        </Button>
        <Button
          onClick={handleError}
          className="bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          Error
        </Button>
        <Button
          onClick={handleInfo}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          Información
        </Button>
        <Button
          onClick={handleWarning}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          size="sm"
        >
          Advertencia
        </Button>
      </div>
    </Card>
  )
}
