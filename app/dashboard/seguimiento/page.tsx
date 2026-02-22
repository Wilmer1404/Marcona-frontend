'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, Loader2, Eye, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DepartamentosService, type Departamento } from '@/services/expedientes.service'
import api from '@/lib/api/axios'
import Link from 'next/link'

interface ExpedienteSeguimiento {
  id: number
  codigo_expediente: string
  asunto: string
  tipo_origen: string
  estado: string
  fecha_creacion: string
  creador: string
  departamento_origen: string
  siglas_origen: string
  total_documentos: string
  ultimo_movimiento: string | null
}

const getEstadoConfig = (estado: string) => {
  switch (estado?.toUpperCase()) {
    case 'REGISTRADO': return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Registrado' }
    case 'EN_PROCESO':  return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', label: 'En Proceso' }
    case 'DERIVADO':    return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', label: 'Derivado' }
    case 'OBSERVADO':   return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', label: 'Observado' }
    case 'FINALIZADO':  return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Finalizado' }
    case 'ARCHIVADO':   return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300', label: 'Archivado' }
    default: return { color: 'bg-gray-100 text-gray-800', label: estado || 'Sin estado' }
  }
}

export default function SeguimientoPage() {
  const [expedientes, setExpedientes] = useState<ExpedienteSeguimiento[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)

  // filtros
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('all')
  const [deptFiltro, setDeptFiltro] = useState('all')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (busqueda)                  params.set('busqueda', busqueda)
    if (estadoFiltro !== 'all')    params.set('estado', estadoFiltro)
    if (deptFiltro !== 'all')      params.set('dept_filtro', deptFiltro)
    if (fechaDesde)                params.set('fecha_desde', fechaDesde)
    if (fechaHasta)                params.set('fecha_hasta', fechaHasta)

    try {
      const res = await api.get(`/expedientes/seguimiento?${params.toString()}`)
      if (res.data.exito) setExpedientes(res.data.data)
    } catch {
      setExpedientes([])
    } finally {
      setLoading(false)
    }
  }, [busqueda, estadoFiltro, deptFiltro, fechaDesde, fechaHasta])

  useEffect(() => {
    cargar()
    DepartamentosService.listar().then(setDepartamentos)
  }, [cargar])

  const limpiarFiltros = () => {
    setBusqueda(''); setEstadoFiltro('all'); setDeptFiltro('all')
    setFechaDesde(''); setFechaHasta('')
  }

  const hayFiltros = busqueda || estadoFiltro !== 'all' || deptFiltro !== 'all' || fechaDesde || fechaHasta

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seguimiento</h1>
        <p className="text-muted-foreground mt-1">
          Busca y monitorea el estado de todos los expedientes
        </p>
      </div>

      {/* Panel de Filtros */}
      <Card className="border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Filtros de Búsqueda</h2>
          {hayFiltros && (
            <Button variant="ghost" size="sm" className="ml-auto gap-1 text-muted-foreground" onClick={limpiarFiltros}>
              <X className="h-3 w-3" />Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Búsqueda de texto */}
          <div className="lg:col-span-3">
            <Label className="text-sm font-medium">Código o Asunto</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 border-border bg-background"
                placeholder="Ej: EXP-2026-0001 o nombre del asunto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <Label className="text-sm font-medium">Estado</Label>
            <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
              <SelectTrigger className="mt-1.5 border-border bg-background">
                <SelectValue placeholder="Todos" />
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

          {/* Departamento Origen */}
          <div>
            <Label className="text-sm font-medium">Departamento Origen</Label>
            <Select value={deptFiltro} onValueChange={setDeptFiltro}>
              <SelectTrigger className="mt-1.5 border-border bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departamentos.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.nombre} ({d.siglas})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha Desde */}
          <div>
            <Label className="text-sm font-medium">Fecha Desde</Label>
            <div className="relative mt-1.5">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-9 border-border bg-background"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
          </div>

          {/* Fecha Hasta */}
          <div>
            <Label className="text-sm font-medium">Fecha Hasta</Label>
            <div className="relative mt-1.5">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-9 border-border bg-background"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Resultados */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            {loading ? 'Cargando...' : `${expedientes.length} expediente${expedientes.length !== 1 ? 's' : ''} encontrado${expedientes.length !== 1 ? 's' : ''}`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : expedientes.length === 0 ? (
          <Card className="border border-border p-12 text-center">
            <p className="text-muted-foreground">No se encontraron expedientes con los filtros aplicados.</p>
            {hayFiltros && (
              <Button variant="link" className="mt-2 text-primary" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {expedientes.map((exp) => {
              const estadoConf = getEstadoConfig(exp.estado)
              const fecha = new Date(exp.fecha_creacion).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
              const ultimoMov = exp.ultimo_movimiento
                ? new Date(exp.ultimo_movimiento).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : null

              return (
                <Card key={exp.id} className="border border-border hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-primary">{exp.codigo_expediente}</span>
                        <Badge className={`${estadoConf.color} border-0 text-xs`}>{estadoConf.label}</Badge>
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          {exp.tipo_origen}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{exp.asunto}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span>📁 {exp.departamento_origen} ({exp.siglas_origen})</span>
                        <span>👤 {exp.creador}</span>
                        <span>📅 {fecha}</span>
                        {ultimoMov && <span>🔄 Último mov.: {ultimoMov}</span>}
                        <span>📎 {exp.total_documentos} doc.</span>
                      </div>
                    </div>

                    {/* Acción */}
                    <Link href={`/dashboard/expediente/${exp.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 border-border flex-shrink-0">
                        <Eye className="h-4 w-4" />Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
