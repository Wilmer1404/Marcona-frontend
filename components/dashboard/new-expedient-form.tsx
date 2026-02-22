'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Check, ChevronRight, ChevronLeft, File, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { ExpedientesService } from '@/services/expedientes.service'
import { DepartamentosService, type Departamento } from '@/services/expedientes.service'
import { useAuth } from '@/contexts/auth-context'

type Step = 'datos' | 'departamento' | 'archivo'

export function NewExpedientForm() {
  const router = useRouter()
  
  // 2. EXTRAEMOS AL USUARIO LOGUEADO
  const { user } = useAuth() 

  const [currentStep, setCurrentStep] = useState<Step>('datos')
  const [isLoading, setIsLoading] = useState(false)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [asunto, setAsunto] = useState('')
  const [prioridad, setPrioridad] = useState('normal')
  const [departamentoDestino, setDepartamentoDestino] = useState('')
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loadingDepts, setLoadingDepts] = useState(true)

  // cargamos los departamentos al montar el componente
  useEffect(() => {
    DepartamentosService.listar().then((data) => {
      setDepartamentos(data)
      setLoadingDepts(false)
    })
  }, [])

  const steps: { id: Step; label: string; number: number }[] = [
    { id: 'datos', label: 'Datos del Documento', number: 1 },
    { id: 'departamento', label: 'Departamento Destino', number: 2 },
    { id: 'archivo', label: 'Adjuntar Archivo', number: 3 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep === 'datos') {
      if (!asunto) {
        toast.error('Por favor ingresa el asunto del expediente')
        return
      }
      setCurrentStep('departamento')
    } else if (currentStep === 'departamento') {
      if (!departamentoDestino) {
        toast.error('Por favor selecciona un departamento de destino')
        return
      }
      setCurrentStep('archivo')
    }
  }

  const handlePrevious = () => {
    const previousStepIndex = currentStepIndex - 1
    if (previousStepIndex >= 0) {
      setCurrentStep(steps[previousStepIndex].id)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0])
    }
  }

  // --- CONEXIÓN REAL AL BACKEND ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. Validaciones estrictas
    if (!user || !user.id) {
      toast.error('Error de sesión. Por favor cierra sesión y vuelve a ingresar.')
      return
    }

    if (!user.departamento_id) {
      toast.error('Tu usuario no tiene un departamento asignado en el sistema. No puedes crear expedientes.')
      setIsLoading(false)
      return
    }

    if (!archivo) {
      toast.error('Por favor adjunta el documento PDF principal')
      return
    }

    setIsLoading(true)

    // 2. Construcción del paquete con los campos EXACTOS que pide tu BD
    const formData = new FormData()
    formData.append('asunto', asunto)
    formData.append('departamento_destino_id', departamentoDestino)
    formData.append('tipo_origen', 'INTERNO') 
    formData.append('usuario_creador_id', user.id.toString())
    formData.append('departamento_origen_id', user.departamento_id.toString())
    
    // NOTA: No enviamos 'prioridad' porque no existe en tu tabla 'expedientes'
    
    formData.append('archivo_adjunto', archivo) // El nombre exacto del multer

    // 3. Envío al backend
    const result = await ExpedientesService.crearExpediente(formData)

    if (result.exito) {
      toast.success('Expediente creado y derivado con éxito')
      router.push('/dashboard') 
    } else {
      toast.error(result.mensaje || 'Hubo un problema al procesar el expediente')
    }

    setIsLoading(false)
  }
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Indicador de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Crear Nuevo Expediente</h2>
          <span className="text-sm text-muted-foreground">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 transition-all duration-500" />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Datos */}
        {currentStep === 'datos' && (
          <Card className="p-6 border border-border space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label htmlFor="asunto" className="text-sm font-medium">
                Asunto del Expediente <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="asunto"
                placeholder="Ej: Solicitud de Licencia Municipal para Local Comercial..."
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="mt-1.5 bg-background border-border resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="prioridad" className="text-sm font-medium">
                Prioridad
              </Label>
              <Select value={prioridad} onValueChange={setPrioridad} disabled={isLoading}>
                <SelectTrigger className="mt-1.5 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Step 2: Departamento */}
        {currentStep === 'departamento' && (
          <Card className="p-6 border border-border space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label htmlFor="departamento" className="text-sm font-medium">
                Selecciona Departamento de Destino <span className="text-red-500">*</span>
              </Label>
              <Select value={departamentoDestino} onValueChange={setDepartamentoDestino} disabled={isLoading || loadingDepts}>
                <SelectTrigger className="mt-1.5 bg-background border-border">
                  <SelectValue placeholder={loadingDepts ? 'Cargando...' : 'Selecciona el área a derivar...'} />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.nombre} ({dept.siglas})
                    </SelectItem>
                  ))}
                  {!loadingDepts && departamentos.length === 0 && (
                    <SelectItem value="" disabled>No hay departamentos disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                El documento será enviado al departamento seleccionado para su atención.
              </p>
            </div>
          </Card>
        )}

        {/* Step 3: Archivo */}
        {currentStep === 'archivo' && (
          <Card className="p-6 border border-border space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label className="text-sm font-medium block mb-4">
                Adjuntar Archivo PDF Principal <span className="text-red-500">*</span>
              </Label>
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Arrastra tu archivo o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se acepta 1 archivo PDF (Max 10MB)
                </p>
              </label>
            </div>

            {archivo && (
              <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                <Label className="text-sm font-medium">Archivo seleccionado</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                  <File className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground flex-1 truncate">
                    {archivo.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(archivo.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    onClick={() => setArchivo(null)}
                    disabled={isLoading}
                  >
                    Quitar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0 || isLoading}
            className="gap-2 border-border"
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </Button>

          {currentStep !== 'archivo' ? (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !archivo}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Crear Expediente
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}