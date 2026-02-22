import axios from 'axios';

// Creamos la instancia principal apuntando a tu backend de Node.js
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate de que tu backend corra en este puerto
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