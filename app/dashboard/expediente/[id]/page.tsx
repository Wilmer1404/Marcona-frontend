'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  File, ArrowLeft, Download, Loader2, AlertTriangle,
  Send, ArrowRightLeft, CheckSquare, MessageSquare, X
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ExpedientTimeline, type MovimientoHistorial } from '@/components/dashboard/expedient-timeline'
import { DepartamentosService, type Departamento } from '@/services/expedientes.service'
import api from '@/lib/api/axios'
import { useAuth } from '@/contexts/auth-context'

interface Documento {
  id: number
  nombre_original: string
  nombre_sistema: string
  tipo_mime: string
  peso_bytes: number
  fecha_subida: string
  subido_por: string
}

interface Expediente {
  id: number
  codigo_expediente: string
  asunto: string
  tipo_origen: string
  estado: string
  fecha_creacion: string
  creador: string
  correo_creador: string
  departamento_origen: string
  siglas_origen: string
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

const formatBytes = (bytes: number) => {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// tipos de modal activo
type ModalType = 'comentar' | 'derivar' | 'estado' | null

export default function ExpedientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const id = params?.id as string

  const [expediente, setExpediente] = useState<Expediente | null>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [historial, setHistorial] = useState<MovimientoHistorial[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // estados de modal y formulario
  const [modalActivo, setModalActivo] = useState<ModalType>(null)
  const [accionLoading, setAccionLoading] = useState(false)
  const [comentario, setComentario] = useState('')
  const [nuevoDeptId, setNuevoDeptId] = useState('')
  const [descripcionDerivar, setDescripcionDerivar] = useState('')
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [descripcionEstado, setDescripcionEstado] = useState('')

  const cargarDetalle = useCallback(async () => {
    try {
      const response = await api.get(`/expedientes/${id}/detalle`)
      if (response.data.exito) {
        setExpediente(response.data.data.expediente)
        setDocumentos(response.data.data.documentos)
        setHistorial(response.data.data.historial)
      } else {
        setError('No se pudo cargar el expediente.')
      }
    } catch {
      setError('Error de conexión al cargar el expediente.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    cargarDetalle()
    DepartamentosService.listar().then(setDepartamentos)
  }, [id, cargarDetalle])

  const cerrarModal = () => {
    setModalActivo(null)
    setComentario(''); setNuevoDeptId(''); setDescripcionDerivar('')
    setNuevoEstado(''); setDescripcionEstado('')
  }

  const handleDescargar = (doc: Documento) => {
    const url = `http://localhost:4000/uploads/expedientes_internos/${doc.nombre_sistema}`
    window.open(url, '_blank')
  }

  const handleComentar = async () => {
    if (!comentario.trim()) { toast.error('El comentario no puede estar vacío'); return }
    setAccionLoading(true)
    try {
      const res = await api.post(`/expedientes/${id}/comentario`, { comentario })
      if (res.data.exito) {
        toast.success('Comentario registrado en el historial')
        cerrarModal()
        await cargarDetalle()
      } else {
        toast.error(res.data.mensaje)
      }
    } catch { toast.error('Error al enviar el comentario') }
    finally { setAccionLoading(false) }
  }

  const handleDerivar = async () => {
    if (!nuevoDeptId) { toast.error('Selecciona el departamento de destino'); return }
    setAccionLoading(true)
    try {
      const res = await api.post(`/expedientes/${id}/derivar`, {
        nuevo_departamento_id: parseInt(nuevoDeptId),
        descripcion: descripcionDerivar || undefined
      })
      if (res.data.exito) {
        toast.success('Expediente derivado correctamente')
        cerrarModal()
        await cargarDetalle()
      } else {
        toast.error(res.data.mensaje)
      }
    } catch { toast.error('Error al derivar el expediente') }
    finally { setAccionLoading(false) }
  }

  const handleCambiarEstado = async () => {
    if (!nuevoEstado) { toast.error('Selecciona el nuevo estado'); return }
    setAccionLoading(true)
    try {
      const res = await api.patch(`/expedientes/${id}/estado`, {
        nuevo_estado: nuevoEstado,
        descripcion: descripcionEstado || undefined
      })
      if (res.data.exito) {
        toast.success(`Estado cambiado a ${nuevoEstado}`)
        cerrarModal()
        await cargarDetalle()
      } else {
        toast.error(res.data.mensaje)
      }
    } catch { toast.error('Error al cambiar el estado') }
    finally { setAccionLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando expediente...</span>
      </div>
    )
  }

  if (error || !expediente) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium">{error || 'Expediente no encontrado'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />Volver
        </Button>
      </div>
    )
  }

  const estadoConfig = getEstadoConfig(expediente.estado)

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10 mb-4">
            <ArrowLeft className="h-4 w-4" />Volver a Mi Bandeja
          </Button>
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{expediente.asunto}</h1>
            <p className="font-mono text-muted-foreground mt-1">{expediente.codigo_expediente}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-4">
          {/* Documentos */}
          <Card className="border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Documentos Adjuntos</h2>
            {documentos.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay documentos adjuntos.</p>
            ) : documentos.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                <File className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.nombre_original}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(doc.peso_bytes)} · {doc.subido_por || 'Sistema'} · {new Date(doc.fecha_subida).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDescargar(doc)}>
                  <Download className="h-4 w-4" />Descargar
                </Button>
              </div>
            ))}
          </Card>

          {/* Info general */}
          <Card className="border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Tipo</p><p className="text-foreground font-medium mt-1">{expediente.tipo_origen}</p></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Estado</p><div className="mt-1"><Badge className={`${estadoConfig.color} border-0`}>{estadoConfig.label}</Badge></div></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Origen</p><p className="text-foreground font-medium mt-1">{expediente.departamento_origen} ({expediente.siglas_origen})</p></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Creador</p><p className="text-foreground font-medium mt-1">{expediente.creador}</p></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Fecha Creación</p><p className="text-foreground font-medium mt-1">{new Date(expediente.fecha_creacion).toLocaleDateString('es-PE')}</p></div>
              <div><p className="text-xs font-medium text-muted-foreground uppercase">Correo</p><p className="text-foreground font-medium mt-1 text-sm">{expediente.correo_creador}</p></div>
            </div>
          </Card>
        </div>

        {/* Panel lateral de acciones */}
        <div className="space-y-4">
          <Card className="border border-border p-6">
            <h3 className="font-semibold text-foreground mb-1">Estado Actual</h3>
            <Badge className={`${estadoConfig.color} border-0 text-sm font-medium mb-4`}>{estadoConfig.label}</Badge>

            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Código</p>
            <p className="font-mono text-primary font-semibold mb-4">{expediente.codigo_expediente}</p>

            <div className="text-xs text-muted-foreground mb-4">
              <p>{documentos.length} doc. adjunto{documentos.length !== 1 ? 's' : ''}</p>
              <p>{historial.length} movimiento{historial.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Acciones */}
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Acciones</p>
              <Button
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setModalActivo('comentar')}
              >
                <MessageSquare className="h-4 w-4" />Agregar Comentario
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 border-border"
                onClick={() => setModalActivo('derivar')}
              >
                <ArrowRightLeft className="h-4 w-4" />Derivar a Departamento
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 border-border"
                onClick={() => setModalActivo('estado')}
              >
                <CheckSquare className="h-4 w-4" />Cambiar Estado
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Historial de Movimientos</h2>
        <ExpedientTimeline historial={historial} />
      </div>

      {/* MODAL — Comentar */}
      {modalActivo === 'comentar' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Agregar Comentario</h3>
              <Button variant="ghost" size="icon" onClick={cerrarModal}><X className="h-4 w-4" /></Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Comentario</Label>
              <Textarea
                className="mt-1.5 border-border bg-background resize-none"
                rows={4}
                placeholder="Escribe tu observación o comentario..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                disabled={accionLoading}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cerrarModal} disabled={accionLoading}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleComentar} disabled={accionLoading}>
                {accionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Enviar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL — Derivar */}
      {modalActivo === 'derivar' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Derivar Expediente</h3>
              <Button variant="ghost" size="icon" onClick={cerrarModal}><X className="h-4 w-4" /></Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Departamento Destino <span className="text-red-500">*</span></Label>
              <Select value={nuevoDeptId} onValueChange={setNuevoDeptId} disabled={accionLoading}>
                <SelectTrigger className="mt-1.5 border-border bg-background">
                  <SelectValue placeholder="Seleccionar departamento..." />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.nombre} ({d.siglas})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Motivo (opcional)</Label>
              <Textarea
                className="mt-1.5 border-border bg-background resize-none"
                rows={3}
                placeholder="Ej: Se deriva para revisión técnica..."
                value={descripcionDerivar}
                onChange={(e) => setDescripcionDerivar(e.target.value)}
                disabled={accionLoading}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cerrarModal} disabled={accionLoading}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleDerivar} disabled={accionLoading}>
                {accionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
                Derivar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL — Cambiar Estado */}
      {modalActivo === 'estado' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cambiar Estado</h3>
              <Button variant="ghost" size="icon" onClick={cerrarModal}><X className="h-4 w-4" /></Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Nuevo Estado <span className="text-red-500">*</span></Label>
              <Select value={nuevoEstado} onValueChange={setNuevoEstado} disabled={accionLoading}>
                <SelectTrigger className="mt-1.5 border-border bg-background">
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGISTRADO">Registrado</SelectItem>
                  <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                  <SelectItem value="OBSERVADO">Observado</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="ARCHIVADO">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Motivo (opcional)</Label>
              <Textarea
                className="mt-1.5 border-border bg-background resize-none"
                rows={3}
                placeholder="Ej: Se aprobó la solicitud..."
                value={descripcionEstado}
                onChange={(e) => setDescripcionEstado(e.target.value)}
                disabled={accionLoading}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cerrarModal} disabled={accionLoading}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCambiarEstado} disabled={accionLoading}>
                {accionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
                Actualizar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
