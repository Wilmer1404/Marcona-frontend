import { NewExpedientForm } from '@/components/dashboard/new-expedient-form'

export const metadata = {
  title: 'Nuevo Expediente - SGD Marcona',
  description: 'Crear un nuevo expediente en el sistema',
}

export default function NuevoExpedientePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nuevo Expediente</h1>
        <p className="text-muted-foreground mt-2">
          Crea un nuevo expediente completando los pasos siguientes
        </p>
      </div>

      <NewExpedientForm />
    </div>
  )
}
