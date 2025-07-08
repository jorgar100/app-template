<!-- Fichero: frontend/src/views/ResourceView.vue -->
<template>
  <div class="d-flex flex-column h-100">
    <!-- Header con título y botón de "Nuevo" -->
    <div class="flex-shrink-0 d-flex justify-content-between align-items-center mb-4" id = "resource-title">
      <h1>{{ title }}</h1>
      <b-button v-if="creatable" id="create-button" variant="primary" @click="openCreateModal">
         <i class="bi bi-plus-lg"></i> New {{ singularTitle }}
      </b-button>
    </div>

    <!-- Contenedor de la tabla, que ocupa el espacio sobrante -->
    <div class="flex-grow-1 position-relative" id="resource-table">
      <AdvancedDataTable
        :items="items" :fields="fields" :is-loading="isLoading"
        @row-clicked="openEditModal"
      >
        <!-- Slot para personalizar la celda de 'role' con un badge de color -->
        <template #cell-role="{ value }">
            <b-badge :class="`text-bg-${roleColor(value)}`">{{ value }}</b-badge>
        </template>
        <!-- Slot para personalizar la celda de 'is_active' con un icono -->
         <template #cell-is_active="{ value }">
            <i :class="value ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'"></i>
        </template>
      </AdvancedDataTable>
    </div>

    <!-- Modal genérico para Creación/Edición -->
    <b-modal v-model="isModalOpen" :title="modalTitle" size="lg" hide-footer>
      <!-- El v-if y la :key son cruciales para que el formulario se reinicie correctamente -->
      <GenericForm
        v-if="isModalOpen"
        :key="formKey"
        :fields="formFields"
        :initial-data="selectedItem"
        @submit="handleFormSubmit"
        @cancel="isModalOpen = false"
      />
    </b-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineProps } from 'vue'; // onUnmounted añadido
import { useTour } from '@/composables/useTour.js';
import { useUiStore } from '@/stores/ui';
import AdvancedDataTable from '@/components/AdvancedDataTable.vue';
import GenericForm from '@/components/GenericForm.vue';
import api from '@/services/api.js';

const props = defineProps({
  title: String,
  singularTitle: String,
  apiResource: String,
  fields: Array,
  formFields: Array,
  creatable: { 
    type: Boolean,
    default: true, 
  },
  tourSteps: { 
    type: Array,
    default: () => []
  }
});

const uiStore = useUiStore();
// ESTA ES LA ÚNICA DECLARACIÓN NECESARIA
const { startTourIfNeeded, resetTour } = useTour(props.apiResource);

const items = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const selectedItem = ref(null);
const formKey = ref(0);

const modalTitle = computed(() => 
  selectedItem.value 
    ? `Edit ${props.singularTitle} #${selectedItem.value.id}`
    : `New ${props.singularTitle}`
);

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await api.getGeneric(props.apiResource);
    items.value = response.data;
  } catch (error) { 
    console.error(`Failed to fetch resource '${props.apiResource}':`, error);
    items.value = [];
  } finally { 
    isLoading.value = false; 
  }
}

function openCreateModal() {
  selectedItem.value = null;
  formKey.value++;
  isModalOpen.value = true;
}

function openEditModal(item) {
  selectedItem.value = { ...item };
  formKey.value++;
  isModalOpen.value = true;
}

async function handleFormSubmit(formData) {
  try {
    if (selectedItem.value) {
      await api.updateGeneric(props.apiResource, selectedItem.value.id, formData);
    } else {
      await api.createGeneric(props.apiResource, formData);
    }
    isModalOpen.value = false;
    await fetchData();
  } catch (error) {
    console.error('Form submission error:', error.response.data);
  }
}

function roleColor(role) {
  const colors = { ROOT: 'danger', ADMIN: 'warning', CLIENT: 'info' };
  return colors[role] || 'secondary';
}

onMounted(() => {
  fetchData();
  
  if (props.tourSteps.length > 0) {
    uiStore.registerTour(props.tourSteps);
    setTimeout(() => startTourIfNeeded(props.tourSteps), 500);
  }
});

onUnmounted(() => {
  uiStore.registerTour(null);
});
</script>