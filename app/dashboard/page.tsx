'use client'

import { useEffect, useState } from 'react'
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExpedientsTable } from '@/components/dashboard/expedients-table'
import Link from 'next/link'
import { ExpedientesService } from '@/services/expedientes.service'

interface Stats {
  total: number
  pendientes: number
  en_proceso: number
  finalizados: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, pendientes: 0, en_proceso: 0, finalizados: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      const response = await ExpedientesService.obtenerEstadisticas()
      if (response.exito && response.data) {
        setStats({
          total: parseInt(response.data.total) || 0,
          pendientes: parseInt(response.data.pendientes) || 0,
          en_proceso: parseInt(response.data.en_proceso) || 0,
          finalizados: parseInt(response.data.finalizados) || 0,
        })
      }
      setLoadingStats(false)
    }
    cargarEstadisticas()
  }, [])

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: {
    title: string
    value: number
    icon: React.ElementType
    colorClass: string
    bgClass: string
  }) => (
    <Card className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {loadingStats ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-2" />
          ) : (
            <p className={`text-2xl font-bold mt-2 ${colorClass}`}>{value}</p>
          )}
        </div>
        <div className={`p-3 ${bgClass} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between lg:flex-row lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Bandeja</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus expedientes y documentos
          </p>
        </div>
        <Link href="/dashboard/nuevo-expediente">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Nuevo Expediente
          </Button>
        </Link>
      </div>

      {/* Stats Grid con datos reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expedientes"
          value={stats.total}
          icon={FileText}
          colorClass="text-primary"
          bgClass="bg-primary/10"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendientes}
          icon={AlertCircle}
          colorClass="text-yellow-600 dark:text-yellow-400"
          bgClass="bg-yellow-100/20"
        />
        <StatCard
          title="En Proceso"
          value={stats.en_proceso}
          icon={Clock}
          colorClass="text-primary"
          bgClass="bg-primary/10"
        />
        <StatCard
          title="Finalizados"
          value={stats.finalizados}
          icon={CheckCircle}
          colorClass="text-green-600 dark:text-green-400"
          bgClass="bg-green-100/20"
        />
      </div>

      {/* Tabla de Expedientes */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Expedientes Recientes
        </h2>
        <ExpedientsTable />
      </div>
    </div>
  )
}
