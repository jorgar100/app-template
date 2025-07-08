<!-- frontend/src/views/LoginView.vue -->
<template>
  <b-container fluid class="d-flex align-items-center justify-content-center h-100">
    <b-col md="6" lg="4">
      <b-card class="shadow">
        <h2 class="text-center mb-4">Login</h2>
        <b-alert v-model="showError" variant="danger" dismissible>
          {{ errorMessage }}
        </b-alert>
        <b-form @submit.prevent="handleSubmit">
          <b-form-group label="Username" label-for="username-input" class="mb-3">
            <b-form-input id="username-input" v-model="username" required></b-form-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password-input" class="mb-4">
            <b-form-input id="password-input" v-model="password" type="password" required></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary" block :disabled="isLoading">
            <b-spinner v-if="isLoading" small></b-spinner>
            <span v-else>Login</span>
          </b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();

async function handleSubmit() {
  isLoading.value = true;
  showError.value = false;
  try {
    await authStore.login({ username: username.value, password: password.value });
    // The store handles redirection on success
  } catch (error) {
    errorMessage.value = 'Invalid credentials. Please try again.';
    showError.value = true;
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>