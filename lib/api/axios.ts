import axios from 'axios';

const api = axios.create({
  // ¡Actualizado al puerto 4000!
  baseURL: 'http://localhost:4000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Se ejecuta ANTES de que cualquier petición salga hacia el backend
api.interceptors.request.use(
  (config) => {
    // Solo en el navegador (cliente) buscamos el token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;