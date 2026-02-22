'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ExpedientesService } from '@/services/expedientes.service'

// Ajustamos la interfaz a lo que devuelve tu backend real
interface Expedient {
  id: number
  codigo_expediente: string
  asunto: string
  departamento_origen: string
  creador: string
  fecha_creacion: string
  estado: string
}

export function ExpedientsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expedients, setExpedients] = useState<Expedient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Llamada real al backend cuando el componente se monta
  useEffect(() => {
    const fetchExpedientes = async () => {
      setIsLoading(true)
      const response = await ExpedientesService.obtenerBandeja()
      if (response.exito) {
        setExpedients(response.data)
      } else {
        console.error("No se pudo cargar la bandeja")
      }
      setIsLoading(false)
    }

    fetchExpedientes()
  }, [])

  // Lógica de filtrado con los nuevos nombres de propiedades
  const filteredExpedients = expedients.filter((exp) => {
    // Protección contra nulos
    const codigo = exp.codigo_expediente || '';
    const asunto = exp.asunto || '';
    const origen = exp.departamento_origen || '';
    const estado = exp.estado || '';

    const matchesSearch =
      codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origen.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || (exp.estado || '').toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  // colores segun los estados reales del schema de la base de datos
  const getStatusConfig = (estado: string) => {
    const e = estado ? estado.toUpperCase() : ''
    switch (e) {
      case 'REGISTRADO':
        return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Registrado' }
      case 'EN_PROCESO':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'En Proceso' }
      case 'DERIVADO':
        return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', label: 'Derivado' }
      case 'OBSERVADO':
        return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', label: 'Observado' }
      case 'FINALIZADO':
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Finalizado' }
      case 'ARCHIVADO':
        return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300', label: 'Archivado' }
      default:
        return { color: 'bg-gray-100 text-gray-800', label: estado || 'Sin estado' }
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros (Se mantienen idénticos) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground block mb-2">
            Buscar expedientes
          </label>
          <Input
            placeholder="Código, asunto u origen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="text-sm font-medium text-foreground block mb-2">
            Estado
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="REGISTRADO">Registrado</SelectItem>
              <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
              <SelectItem value="DERIVADO">Derivado</SelectItem>
              <SelectItem value="OBSERVADO">Observado</SelectItem>
              <SelectItem value="FINALIZADO">Finalizado</SelectItem>
              <SelectItem value="ARCHIVADO">Archivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="gap-2 border-border">
          <Filter className="h-4 w-4" />
          Más filtros
        </Button>
      </div>

      {/* Tabla */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold">Asunto</TableHead>
                <TableHead className="font-semibold">Origen</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p>Cargando expedientes de la base de datos...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredExpedients.length > 0 ? (
                filteredExpedients.map((expedient) => {
                  const statusInfo = getStatusConfig(expedient.estado)

                  return (
                    <TableRow
                      key={expedient.id}
                      className="hover:bg-muted/30 border-b border-border"
                    >
                      <TableCell className="font-mono text-sm font-semibold text-primary">
                        {expedient.codigo_expediente}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {expedient.asunto}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex flex-col">
                          <span>{expedient.departamento_origen}</span>
                          <span className="text-xs opacity-70">{expedient.creador}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(expedient.fecha_creacion).toLocaleDateString('es-PE')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            statusInfo.color,
                            'font-medium border-0'
                          )}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/expediente/${expedient.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                            Ver detalles
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron expedientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando {filteredExpedients.length} de {expedients.length} expedientes reales</span>
      </div>
    </div>
  )
}