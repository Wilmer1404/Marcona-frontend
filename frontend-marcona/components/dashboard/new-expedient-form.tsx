'use client'

import { useState } from 'react'
import { Upload, Check, ChevronRight, ChevronLeft, File } from 'lucide-react'
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

type Step = 'datos' | 'departamento' | 'archivo'

export function NewExpedientForm() {
  const [currentStep, setCurrentStep] = useState<Step>('datos')
  const [files, setFiles] = useState<File[]>([])

  // Step 1: Datos
  const [asunto, setAsunto] = useState('')
  const [tipo, setTipo] = useState('')
  const [prioridad, setPrioridad] = useState('normal')

  // Step 2: Departamento
  const [departamento, setDepartamento] = useState('')

  const steps: { id: Step; label: string; number: number }[] = [
    { id: 'datos', label: 'Datos del Documento', number: 1 },
    { id: 'departamento', label: 'Departamento Destino', number: 2 },
    { id: 'archivo', label: 'Adjuntar Archivo', number: 3 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep === 'datos') {
      if (!asunto || !tipo) {
        toast.error('Por favor completa todos los campos')
        return
      }
      setCurrentStep('departamento')
    } else if (currentStep === 'departamento') {
      if (!departamento) {
        toast.error('Por favor selecciona un departamento')
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
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      toast.error('Por favor adjunta al menos un archivo')
      return
    }
    toast.success('Expediente creado exitosamente')
    setAsunto('')
    setTipo('')
    setDepartamento('')
    setFiles([])
    setCurrentStep('datos')
  }

  return (
    <div className="space-y-6">
      {/* Indicador de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Crear Nuevo Expediente</h2>
          <span className="text-sm text-muted-foreground">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Indicadores de pasos */}
      <div className="flex justify-between gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                index <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 rounded-full transition-all ${
                  index < currentStepIndex
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Datos */}
        {currentStep === 'datos' && (
          <Card className="p-6 border border-border space-y-4">
            <div>
              <Label htmlFor="asunto" className="text-sm font-medium">
                Asunto del Expediente
              </Label>
              <Input
                id="asunto"
                placeholder="Ej: Solicitud de Licencia Municipal"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="mt-1.5 bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="tipo" className="text-sm font-medium">
                Tipo de Documento
              </Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="mt-1.5 bg-background border-border">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solicitud">Solicitud</SelectItem>
                  <SelectItem value="tramite">Trámite</SelectItem>
                  <SelectItem value="informe">Informe</SelectItem>
                  <SelectItem value="aprobacion">Aprobación</SelectItem>
                  <SelectItem value="autorizacion">Autorización</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridad" className="text-sm font-medium">
                Prioridad
              </Label>
              <Select value={prioridad} onValueChange={setPrioridad}>
                <SelectTrigger className="mt-1.5 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Step 2: Departamento */}
        {currentStep === 'departamento' && (
          <Card className="p-6 border border-border space-y-4">
            <div>
              <Label htmlFor="departamento" className="text-sm font-medium">
                Selecciona Departamento de Destino
              </Label>
              <Select value={departamento} onValueChange={setDepartamento}>
                <SelectTrigger className="mt-1.5 bg-background border-border">
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gerencia-comercio">Gerencia de Comercio</SelectItem>
                  <SelectItem value="gerencia-catastral">Gerencia Catastral</SelectItem>
                  <SelectItem value="gerencia-obras">Gerencia de Obras</SelectItem>
                  <SelectItem value="gerencia-servicios">Gerencia de Servicios</SelectItem>
                  <SelectItem value="gerencia-rh">Gerencia de RRHH</SelectItem>
                  <SelectItem value="gerencia-legal">Gerencia Legal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                El documento será enviado al departamento seleccionado
              </p>
            </div>
          </Card>
        )}

        {/* Step 3: Archivo */}
        {currentStep === 'archivo' && (
          <Card className="p-6 border border-border space-y-4">
            <div>
              <Label className="text-sm font-medium block mb-4">
                Adjuntar Archivos PDF
              </Label>
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Arrastra archivos o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Solo se aceptan archivos PDF
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Archivos Adjuntos</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                    >
                      <File className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="gap-2 border-border"
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </Button>

          {currentStep !== 'archivo' ? (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
            >
              <Check className="h-4 w-4" />
              Crear Expediente
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
