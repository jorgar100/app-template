// Fichero: frontend/src/router/index.js
// English comments as requested.

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// We will create these view components in the next steps.
// For now, we can create placeholder components.
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ResourceView from '@/views/ResourceView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      // 'meta' fields are a great way to add extra info to routes
      // We'll use this for permissions later.
      // 'public: true' means this route does not require authentication.
      public: true, 
    }
  },
  // Placeholder for the user management page
  {
    path: '/admin/user-management',
    name: 'UserManagement',
    component: ResourceView, 
    props: {
      title: 'User Management',
      singularTitle: 'User',
      apiResource: 'users', 
      creatable: false,
      fields: [ 
        { key: 'id', label: 'ID', sortable: true },
        { key: 'username', label: 'Username', sortable: true, filterable: true },
        { key: 'email', label: 'Email', sortable: true, filterable: true },
        { key: 'role', label: 'Role', sortable: true, filterable: true, filter: {
            type: 'select',
            options: [{value: 'ROOT', text: 'Root'}, {value: 'ADMIN', text: 'Admin'}, {value: 'CLIENT', text: 'Client'}]
          }
        },
      ],
      formFields: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'first_name', label: 'First Name', type: 'text', required: false },
        { name: 'last_name', label: 'Last Name', type: 'text', required: false },
        { name: 'role', label: 'Role', type: 'select', required: true, 
          options: [
            { value: null, text: 'Select a role...', disabled: true },
            { value: 'ROOT', text: 'Root' },
            { value: 'ADMIN', text: 'Admin' },
            { value: 'CLIENT', text: 'Client' },
          ]
        },
        { name: 'is_active', label: 'User is Active', type: 'checkbox', defaultValue: true },
      ],
      tourSteps: [
    {
      id: 'step-1-welcome',
      attachTo: { element: '#resource-title', on: 'bottom' },
      title: 'User Management',
      text: 'Welcome to the user management page. Here you can view and edit user roles.',
      buttons: [
        {
          action: 'next', // La acción que realiza el botón
          text: 'Next →' // El texto del botón (puedes usar HTML)
        }
      ]
    },
    {
      id: 'step-2-table',
      attachTo: { element: '#resource-table', on: 'bottom' },
      title: 'User List',
      text: 'This table displays all users in the system. You can use the search boxes in each column to filter the results.',
      buttons: [
        {
          action: 'back',
          classes: 'shepherd-button-secondary', // Clase para un estilo diferente
          text: '← Back'
        },
        {
          action: 'next',
          text: 'Next →'
        }
      ]
    },
    {
      id: 'step-3-edit',
      attachTo: { element: '#resource-table', on: 'bottom' },
      title: 'Editing Roles',
      text: 'To edit a user, simply click on their row. A modal will appear allowing you to change their role and other attributes.',
      buttons: [
        {
          action: 'back',
          classes: 'shepherd-button-secondary',
          text: '← Back'
        },
        {
          action: 'next',
          text: 'Next →'
        }
      ]
    },
    {
      id: 'step-4-creation',
      attachTo: { element: 'header', on: 'bottom' },
      title: 'User Creation',
      text: 'Note: New users are created automatically when they log in for the first time with valid external credentials. Their default role is "CLIENT".',
      buttons: [
        {
          action: 'back',
          classes: 'shepherd-button-secondary',
          text: '← Back'
        },
        {
          action: 'complete', 
          text: 'Got it! Finish'
        }
      ]
    }
  ]
    },
    meta: { requiredRole: 'ROOT' }
  },
  {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { public: true } // Accessible to everyone
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // 'to': la ruta a la que el usuario quiere ir.
  // 'from': la ruta de la que viene.
  // 'next': la función que debemos llamar para permitir, redirigir o bloquear la navegación.

  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  const isPublicRoute = to.meta.public;
  const requiredRole = to.meta.requiredRole;

  // Case 1: The route is public (like Login or Home page)
  // Anyone can access it.
  if (isPublicRoute) {
    return next(); // Allow navigation
  }

  // Case 2: The route is NOT public, but the user is NOT authenticated.
  // Redirect them to the login page.
  if (!isAuthenticated) {
    return next({ name: 'Login' }); // Redirect to Login
  }

  // Case 3: The route requires a specific role, and the user IS authenticated.
  // Check if the user has the required role.
  if (requiredRole && authStore.userRole !== requiredRole) {
    // User does not have permission. Redirect them to a 'Forbidden' page or Home.
    // For now, let's redirect to Home with an alert (in a real app, a dedicated 403 page is better).
    console.warn(`Access denied. Route requires role '${requiredRole}', but user has role '${authStore.userRole}'.`);
    return next({ name: 'Home' }); // Redirect to Home
  }

  // Case 4: The user is authenticated and has permission (or the route doesn't require a specific role).
  // Allow navigation.
  return next();
});

export default router;