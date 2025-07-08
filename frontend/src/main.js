// Fichero: frontend/src/main.js

import { createApp } from 'vue';

// Importa el componente raíz de la aplicación
import App from './App.vue';

// Importa los plugins
import router from './router'; 
import { createBootstrap } from 'bootstrap-vue-next';

// Importa los estilos CSS necesarios
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import pinia from './stores';
import { useAuthStore } from './stores/auth';

import i18n from './i18n';

import 'shepherd.js/dist/css/shepherd.css';

// Crea la instancia de la aplicación
const app = createApp(App);

// --- REGISTRO DE PLUGINS ---
// Es crucial que los plugins se registren ANTES de montar la aplicación.

// 1. Registra BootstrapVueNext y dile que incluya todos los componentes.
app.use(createBootstrap({ components: true, directives: true }));

// 3.Usar pinia
app.use(pinia);

// 3. Registra Vue Router.
const authStore = useAuthStore();
authStore.loadUserFromToken();
app.use(router);

// 4.Usar i18n
app.use(i18n);

// 5. Monta la aplicación en el elemento #app del DOM.
// Este debe ser el último paso.
app.mount('#app');