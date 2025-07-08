// frontend/src/i18n/index.js

import { createI18n } from 'vue-i18n';
import en from './en.json';
import es from './es.json';

const i18n = createI18n({
  legacy: false, // Use the new Vue 3 Composition API
  locale: localStorage.getItem('language') || 'en', // Set initial locale
  fallbackLocale: 'en', // Fallback to English if a translation is missing
  messages: {
    en,
    es,
  },
});

export default i18n;