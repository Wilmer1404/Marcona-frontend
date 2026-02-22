'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Filter } from 'lucide-react'
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

interface Expedient {
  id: string
  codigo: string
  asunto: string
  origen: string
  fecha: string
  estado: 'pendiente' | 'revision' | 'finalizado'
  prioridad: 'normal' | 'alta'
}

const mockExpedients: Expedient[] = [
  {
    id: '1',
    codigo: 'EXP-2024-001',
    asunto: 'Solicitud de Licencia Municipal',
    origen: 'Gerencia de Comercio',
    fecha: '21/02/2024',
    estado: 'revision',
    prioridad: 'normal',
  },
  {
    id: '2',
    codigo: 'EXP-2024-002',
    asunto: 'Trámite de Registro de Propiedad',
    origen: 'Gerencia Catastral',
    fecha: '20/02/2024',
    estado: 'pendiente',
    prioridad: 'alta',
  },
  {
    id: '3',
    codigo: 'EXP-2024-003',
    asunto: 'Aprobación de Proyecto de Obra',
    origen: 'Gerencia de Obras',
    fecha: '19/02/2024',
    estado: 'finalizado',
    prioridad: 'normal',
  },
  {
    id: '4',
    codigo: 'EXP-2024-004',
    asunto: 'Autorización de Actividad Comercial',
    origen: 'Gerencia de Comercio',
    fecha: '18/02/2024',
    estado: 'revision',
    prioridad: 'normal',
  },
  {
    id: '5',
    codigo: 'EXP-2024-005',
    asunto: 'Solicitud de Servicios Básicos',
    origen: 'Gerencia de Servicios',
    fecha: '17/02/2024',
    estado: 'pendiente',
    prioridad: 'alta',
  },
]

const statusConfig = {
  pendiente: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    label: 'Pendiente',
  },
  revision: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    label: 'En Revisión',
  },
  finalizado: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    label: 'Finalizado',
  },
}

export function ExpedientsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expedients, setExpedients] = useState(mockExpedients)

  const filteredExpedients = expedients.filter((exp) => {
    const matchesSearch =
      exp.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.origen.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || exp.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Filtros */}
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
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="revision">En Revisión</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="gap-2 border-border"
        >
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
              {filteredExpedients.length > 0 ? (
                filteredExpedients.map((expedient) => {
                  const statusConfig_item = statusConfig[expedient.estado]

                  return (
                    <TableRow
                      key={expedient.id}
                      className="hover:bg-muted/30 border-b border-border"
                    >
                      <TableCell className="font-mono text-sm font-semibold text-primary">
                        {expedient.codigo}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {expedient.asunto}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {expedient.origen}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {expedient.fecha}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            statusConfig_item.color,
                            'font-medium border-0'
                          )}
                        >
                          {statusConfig_item.label}
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
        <span>Mostrando {filteredExpedients.length} de {expedients.length} expedientes</span>
      </div>
    </div>
  )
}
