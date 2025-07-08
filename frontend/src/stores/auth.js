// Fichero: frontend/src/stores/auth.js

import { defineStore } from 'pinia';
import api from '@/services/api.js';
import router from '@/router';

// Helper function to decode JWT token payload without external libraries
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error decoding JWT', e);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    userRole: (state) => (state.user ? state.user.role : null),
  },

  actions: {
    async login(credentials) {
      // api.js doesn't have a login function, we'll use axios directly from it.
      const response = await api.login(credentials);
      
      this.accessToken = response.data.access;
      this.refreshToken = response.data.refresh;

      // Decode user info from the token and store it
      const userData = decodeJwt(this.accessToken);
      this.user = {
        id: userData.user_id,
        username: userData.username,
        role: userData.role,
      };

      // Persist to localStorage
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      localStorage.setItem('user', JSON.stringify(this.user));

      // Redirect to home page after login
      router.push({ name: 'Home' });
    },

    logout() {
      // Clear state
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Redirect to login page
      router.push({ name: 'Login' });
    },

    // This action will be called when the app first loads
    // to see if the user is already logged in from a previous session.
    loadUserFromToken() {
      const token = this.accessToken;
      if (token) {
        const userData = decodeJwt(token);
        if (userData) {
          this.user = {
            id: userData.user_id,
            username: userData.username,
            role: userData.role,
          };
        } else {
          // Token is invalid or expired, so log out
          this.logout();
        }
      }
    },
  },
});