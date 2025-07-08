<!-- Fichero: frontend/src/App.vue -->
<template>
  <!-- Ya no necesitamos :data-bs-theme aquí, Pinia lo gestiona en el <html> -->
  <div id="app-container">
    <header class="flex-shrink-0">
      <b-navbar toggleable="lg" :variant="uiStore.theme" class="shadow-sm position-relative" >
        <!-- Izquierda: Menú de Secciones -->
        <b-nav-item-dropdown no-caret>
          <template #button-content>
            <i class="bi bi-list"></i> {{ $t('menu') }}
          </template>
          <b-dropdown-item :to="{ name: 'Home' }">{{ $t('home') }}</b-dropdown-item>
          <b-dropdown-item 
            v-if="authStore.isAuthenticated && authStore.userRole === 'ROOT'"
            :to="{ name: 'UserManagement' }"
          >
            {{ $t('userManagement') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- Center: Logo block -->
         <div class="navbar-center-block">
          <!-- Usamos un <router-link> para envolver todo el bloque y hacerlo clicable -->
          <router-link :to="{ name: 'Home' }" class="navbar-brand mx-auto d-flex align-items-center">
            <!-- Logo de la Empresa (dinámico) -->
            <img :src="companyLogoSrc" alt="Company Logo" class="navbar-logo">
            
            <!-- Título de la Aplicación -->
            <span class="mx-3 navbar-title">App Template</span>
            
            <!-- Logo de la Aplicación (dinámico) -->
            <img :src="appLogoSrc" alt="Application Logo" class="navbar-logo">
          </router-link>
        </div>
        <!-- Right: Controls -->
         
          <b-navbar-nav class="ms-auto flex-row align-items-center">
            <b-nav-item v-if="uiStore.isTourAvailable" @click="uiStore.triggerTour" class="me-2">
            <i class="bi bi-question-circle-fill"></i>
          </b-nav-item>

            <!-- Theme & Language controls are the same -->
            <b-nav-item @click="uiStore.toggleTheme" class="me-2">
              <i :class="uiStore.theme === 'light' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill'"></i>
            </b-nav-item>

            <b-nav-item-dropdown no-caret class="me-2">
             <template #button-content>
              <i class="bi bi-translate"></i>
            </template>
            <b-dropdown-item @click="uiStore.setLanguage('en')">English</b-dropdown-item>
            <b-dropdown-item @click="uiStore.setLanguage('es')">Español</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- DYNAMIC AUTH SECTION -->
          <!-- Show this if the user is NOT authenticated -->
          <b-button v-if="!authStore.isAuthenticated" :to="{ name: 'Login' }" variant="outline-secondary" size="sm">
            <i class="bi bi-person-circle"></i> {{ $t('login') }}
          </b-button>
          
          <!-- Show this if the user IS authenticated -->
          <b-nav-item-dropdown v-else right no-caret>
            <template #button-content>
              <i class="bi bi-person-fill"></i> {{ authStore.user.username }}
            </template>
            <b-dropdown-item @click="authStore.logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </header>

    <main class="flex-grow-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUiStore } from '@/stores/ui'; // Import our UI store
import { useAuthStore } from '@/stores/auth'; // Import auth store
import { computed } from 'vue';

const uiStore = useUiStore();
const authStore = useAuthStore();

// Initialize the theme when the app is mounted for the first time
onMounted(() => {
  uiStore.initializeTheme();
  authStore.loadUserFromToken();
});

const companyLogoSrc = computed(() => {
  return uiStore.theme === 'light' ? '/Horse-light.png' : '/Horse-dark.png';
});

const appLogoSrc = computed(() => {
  return uiStore.theme === 'light' ? '/app-logo-light.png' : '/app-logo-dark.png';
});
</script>

<style>

/* Flexbox layout to prevent page scroll */
html, body, #app {
  height: 100%;
  margin: 0;
}

#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

main {
  overflow-y: auto;
  padding: 1.5rem;
}

/* --- THEME DEFINITIONS --- */

/* Light Theme (Black & White) */
[data-bs-theme="light"] {
  --bs-body-bg: #ffffff;
  --bs-body-color: #212529;
  --bs-secondary-bg: #f8f9fa;
  --bs-border-color: #dee2e6;
}

/* Dark Theme */
[data-bs-theme="dark"] {
  --bs-body-bg: #212529;
  --bs-body-color: #f8f9fa;
  --bs-secondary-bg: #343a40;
  --bs-border-color: #495057;
}

.navbar-brand {
  text-decoration: none; /* Quita el subrayado del link */
}
.navbar-logo {
  height: 35px; /* Ajusta la altura de los logos */
}
.navbar-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--bs-navbar-brand-color);
}
.navbar-center-block {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* --- Shepherd.js Theming --- */
:root {
  /* Adaptamos las variables de Shepherd a nuestro tema */
  --shepherd-font-family: inherit;
  --shepherd-text-color: var(--bs-body-color);
  --shepherd-background-color: var(--bs-body-bg);
  --shepherd-header-background-color: var(--bs-secondary-bg);
  --shepherd-button-background-color: var(--bs-primary);
  --shepherd-button-text-color: var(--bs-light);
}
.shepherd-button:not(:disabled):hover {
  background: var(--bs-secondary);
}
</style>