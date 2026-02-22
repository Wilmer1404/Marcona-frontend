import api from '@/lib/api/axios'

export interface Departamento {
  id: number
  nombre: string
  siglas: string
}

export const DepartamentosService = {
  listar: async (): Promise<Departamento[]> => {
    try {
      const response = await api.get('/departamentos')
      return response.data.exito ? response.data.data : []
    } catch (error) {
      console.error('Error obteniendo departamentos:', error)
      return []
    }
  }
}

export const ExpedientesService = {
  obtenerBandeja: async () => {
    try {
      const response = await api.get('/expedientes/bandeja')
      return response.data
    } catch (error) {
      console.error("Error obteniendo bandeja:", error)
      return { exito: false, data: [] }
    }
  },

  obtenerEstadisticas: async () => {
    try {
      const response = await api.get('/expedientes/estadisticas')
      return response.data
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      return { exito: false, data: { total: 0, pendientes: 0, en_proceso: 0, finalizados: 0 } }
    }
  },

  crearExpediente: async (formData: FormData) => {
    try {
      const response = await api.post('/expedientes/nuevo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Axios requires explicit override or undefined for FormData when a default JSON header is set
        }
      })
      return response.data
    } catch (error: any) {
      console.error("Error creando expediente:", error)
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || "Error al crear el expediente" 
      }
    }
  }
}