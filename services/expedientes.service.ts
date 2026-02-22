import api from '@/lib/api/axios'

export const ExpedientesService = {
  // Función para obtener la bandeja del usuario logueado
  obtenerBandeja: async () => {
    try {
      const response = await api.get('/expedientes/bandeja')
      return response.data // Retorna { exito: true, data: [...] }
    } catch (error) {
      console.error("Error obteniendo bandeja:", error)
      return { exito: false, data: [] }
    }
  }
}