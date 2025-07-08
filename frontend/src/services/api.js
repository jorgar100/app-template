// Fichero: frontend/src/services/api.js

import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // Importamos el auth store

// --- 1. CREACIÓN DE LA INSTANCIA PRECONFIGURADA DE AXIOS ---
const apiClient = axios.create({
  // La URL base de nuestra API de Django
  baseURL: 'http://127.0.0.1:8000/api',
  // Cabeceras por defecto para todas las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});


// --- 2. INTERCEPTOR DE PETICIONES (REQUEST INTERCEPTOR) ---
// Esta es la parte mágica. Antes de que CUALQUIER petición se envíe,
// este interceptor se ejecuta y puede modificarla.
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el auth store para acceder al token
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    // Si tenemos un token, lo añadimos a la cabecera 'Authorization'
    if (token) {
      // El formato 'Bearer' es el estándar para JWT
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Devolvemos la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // En caso de un error de configuración, lo rechazamos
    return Promise.reject(error);
  }
);


// --- 3. EXPORTACIÓN DE LOS MÉTODOS DE LA API ---
// Ahora todos los métodos usarán nuestra instancia 'apiClient' preconfigurada.
export default {
    
  // Auth methods
  login(credentials) {
    // La petición de login es especial, no necesita el token, pero la hacemos
    // con la misma instancia para mantener la consistencia de la baseURL.
    return apiClient.post('/token/', credentials);
  },
  
  // User management methods
  getUsers() {
    return apiClient.get('/users/');
  },
  updateUserRole(userId, role) {
    // Usamos PATCH porque solo estamos actualizando un campo
    return apiClient.patch(`/users/${userId}/`, { role });
  },

  getGeneric(resource) { return apiClient.get(`/${resource}/`); },
  createGeneric(resource, data) { return apiClient.post(`/${resource}/`, data); },
  updateGeneric(resource, id, data) { return apiClient.patch(`/${resource}/${id}/`, data); },
  deleteGeneric(resource, id) { return apiClient.delete(`/${resource}/${id}/`); }
};