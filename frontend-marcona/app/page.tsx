import { redirect } from 'next/navigation'

export const metadata = {
  title: 'SGD Marcona - Sistema de Gestión Documental',
  description: 'Bienvenido al Sistema de Gestión Documental Municipal',
}

export default function HomePage() {
  // Redirigir a login
  redirect('/login')
}
