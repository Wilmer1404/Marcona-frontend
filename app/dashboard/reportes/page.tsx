'use client'

import { useEffect, useState } from 'react'
import { BarChart2, FileText, Download, Loader2, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api/axios'
import * as XLSX from 'xlsx'

interface Resumen {
  total: string
  pendientes: string
  en_proceso: string
  finalizados: string
  total_documentos: string
}
interface PorEstado  { estado: string; total: string }
interface PorDepto   { departamento: string; siglas: string; total: string }
interface Tendencia  { fecha: string; total: string }

interface ReportData {
  resumen: Resumen
  por_estado: PorEstado[]
  por_departamento: PorDepto[]
  tendencia_30_dias: Tendencia[]
}

// ---- helpers de color -------------------------------------------------------
const estadoColor: Record<string, string> = {
  REGISTRADO: '#eab308', EN_PROCESO: '#3b82f6',
  DERIVADO: '#a855f7', OBSERVADO: '#f97316',
  FINALIZADO: '#22c55e', ARCHIVADO: '#6b7280',
}
const estadoLabel: Record<string, string> = {
  REGISTRADO: 'Registrado', EN_PROCESO: 'En Proceso',
  DERIVADO: 'Derivado',    OBSERVADO: 'Observado',
  FINALIZADO: 'Finalizado', ARCHIVADO: 'Archivado',
}

// ---- mini barra horizontal --------------------------------------------------
function BarraHorizontal({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 truncate">{label}</span>
      <div className="flex-1 bg-muted/40 rounded-full h-3">
        <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-foreground w-6 text-right">{value}</span>
    </div>
  )
}

// ---- gráfico de línea SVG ---------------------------------------------------
function LineChart({ datos }: { datos: Tendencia[] }) {
  if (datos.length === 0) return <p className="text-sm text-muted-foreground text-center py-6">Sin datos en los últimos 30 días.</p>
  const vals = datos.map(d => parseInt(d.total))
  const maxVal = Math.max(...vals, 1)
  const W = 500; const H = 110; const PAD = 20
  const stepX = vals.length > 1 ? (W - PAD * 2) / (vals.length - 1) : 0
  const points = vals.map((v, i) => ({ x: PAD + i * stepX, y: PAD + (1 - v / maxVal) * (H - PAD * 2) }))
  const poly = points.map(p => `${p.x},${p.y}`).join(' ')
  const area = `${points[0].x},${H - PAD} ${poly} ${points[points.length - 1].x},${H - PAD}`

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#lineGrad)" />
        <polyline points={poly} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />)}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground px-5 -mt-1">
        <span>{datos[0]?.fecha ? new Date(datos[0].fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }) : ''}</span>
        <span>{datos[datos.length - 1]?.fecha ? new Date(datos[datos.length - 1].fecha).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }) : ''}</span>
      </div>
    </div>
  )
}

export default function ReportesPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/expedientes/reportes').then(res => {
      if (res.data.exito) setData(res.data.data)
    }).finally(() => setLoading(false))
  }, [])

  // ---- exportar a Excel -------------------------------------------------------
  const exportarExcel = () => {
    if (!data) return
    const wb = XLSX.utils.book_new()

    // hoja 1: resumen
    const resumenData = [
      ['Métrica', 'Valor'],
      ['Total Expedientes', data.resumen.total],
      ['Pendientes / Observados', data.resumen.pendientes],
      ['En Proceso / Derivados', data.resumen.en_proceso],
      ['Finalizados / Archivados', data.resumen.finalizados],
      ['Total Documentos', data.resumen.total_documentos],
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumenData), 'Resumen')

    // hoja 2: por estado
    const estadoData = [['Estado', 'Total'], ...data.por_estado.map(r => [estadoLabel[r.estado] || r.estado, r.total])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(estadoData), 'Por Estado')

    // hoja 3: por departamento
    const deptData = [['Departamento', 'Siglas', 'Total'], ...data.por_departamento.map(r => [r.departamento, r.siglas, r.total])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(deptData), 'Por Departamento')

    // hoja 4: tendencia
    const tendData = [['Fecha', 'Expedientes'], ...data.tendencia_30_dias.map(r => [r.fecha, r.total])]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tendData), 'Tendencia 30 Días')

    XLSX.writeFile(wb, `Reporte_SGD_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Generando reporte...</span>
      </div>
    )
  }

  if (!data) {
    return <p className="text-destructive text-center mt-16">Error al cargar los datos del reporte.</p>
  }

  const maxEstado = Math.max(...data.por_estado.map(e => parseInt(e.total)), 1)
  const maxDept   = Math.max(...data.por_departamento.map(d => parseInt(d.total)), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-1">Estadísticas y análisis del sistema de expedientes</p>
        </div>
        <Button onClick={exportarExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white w-fit">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Expedientes', value: data.resumen.total,           icon: FileText,     cls: 'text-primary',                    bg: 'bg-primary/10' },
          { label: 'Pendientes',        value: data.resumen.pendientes,       icon: AlertCircle,  cls: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100/20' },
          { label: 'En Proceso',        value: data.resumen.en_proceso,       icon: Clock,        cls: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-100/20' },
          { label: 'Finalizados',       value: data.resumen.finalizados,      icon: CheckCircle,  cls: 'text-green-600 dark:text-green-400',   bg: 'bg-green-100/20' },
        ].map(({ label, value, icon: Icon, cls, bg }) => (
          <Card key={label} className="p-5 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${cls}`}>{value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${bg}`}><Icon className={`h-5 w-5 ${cls}`} /></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Estado */}
        <Card className="border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Distribución por Estado</h2>
          </div>
          {data.por_estado.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sin datos disponibles.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {data.por_estado.map(e => (
                <BarraHorizontal
                  key={e.estado}
                  label={estadoLabel[e.estado] || e.estado}
                  value={parseInt(e.total)}
                  max={maxEstado}
                  color={estadoColor[e.estado] || '#6b7280'}
                />
              ))}
              {/* leyenda */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                {data.por_estado.map(e => (
                  <Badge key={e.estado} variant="outline" className="text-xs gap-1 border-border">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: estadoColor[e.estado] || '#6b7280' }} />
                    {estadoLabel[e.estado] || e.estado} ({e.total})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Por Departamento */}
        <Card className="border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-purple-500" />
            <h2 className="font-semibold text-foreground">Expedientes por Departamento</h2>
          </div>
          {data.por_departamento.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sin datos disponibles.</p>
          ) : (
            <div className="space-y-3 mt-2">
              {data.por_departamento.map((d, i) => (
                <BarraHorizontal
                  key={d.departamento}
                  label={`${d.departamento} (${d.siglas})`}
                  value={parseInt(d.total)}
                  max={maxDept}
                  color={`hsl(${260 + i * 25}, 70%, 55%)`}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Gráfico de tendencia */}
      <Card className="border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold text-foreground">Tendencia de los últimos 30 días</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {data.tendencia_30_dias.reduce((s, d) => s + parseInt(d.total), 0)} expedientes en el período
          </span>
        </div>
        <LineChart datos={data.tendencia_30_dias} />
      </Card>

      {/* Total documentos */}
      <Card className="border border-border p-5 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg"><FileText className="h-6 w-6 text-primary" /></div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Total de documentos adjuntos en el sistema</p>
          <p className="text-2xl font-bold text-primary">{data.resumen.total_documentos}</p>
        </div>
      </Card>
    </div>
  )
}
