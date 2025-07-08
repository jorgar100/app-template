//frontend/src/stores/ui.js

import { defineStore } from 'pinia';
import i18n from '@/i18n';

// We define a store by giving it a unique ID ('ui')
export const useUiStore = defineStore('ui', {
  // The state is a function that returns the initial state object.
  state: () => ({
    // We try to load the theme from localStorage to persist user's choice.
    // If not found, default to 'light'.
    theme: localStorage.getItem('theme') || 'light',
    
    // Same for language, defaulting to English.
    language: localStorage.getItem('language') || 'en',

    activeTourResetter: null,
  }),
  getters: {
    isTourAvailable: (state) => !!state.activeTourSteps && state.activeTourSteps.length > 0,
  },

  // Actions are like methods. They are used to change the state.
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme;
      // Persist the choice in localStorage
      localStorage.setItem('theme', newTheme);
      // We also update the data-bs-theme attribute on the root html element
      document.documentElement.setAttribute('data-bs-theme', newTheme);
    },
    
    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },
    
    setLanguage(newLang) {
            this.language = newLang;
            localStorage.setItem('language', newLang);
            i18n.global.locale.value = newLang;
    },
    // Action to initialize theme on app load
    initializeTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },
    registerTour(stepsConfig) {
      this.activeTourSteps = stepsConfig;
    },
    triggerTour() {
      // Necesitamos una forma de acceder a la instancia del tour.
      // La mejor manera es crearla bajo demanda.
      if (this.isTourAvailable) {
        // Importamos dinámicamente el composable SÓLO cuando se necesita.
        import('@/composables/useTour.js').then(({ useTour }) => {
          // Creamos una instancia temporal del tour con un nombre genérico
          const tourHandler = useTour('manual_tour');
          // Y llamamos a la función que lo fuerza
          tourHandler.forceStartTour(this.activeTourSteps);
        });
      }
    },
  },
});