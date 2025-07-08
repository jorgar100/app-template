<!-- Fichero: frontend/src/components/GenericForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <!-- El bucle 'v-for' genera dinámicamente los campos del formulario -->
    <!-- según la configuración 'fields' que recibe como prop. -->
    <div v-for="field in fields" :key="field.name" class="mb-3">

      <!-- Renderiza un input de texto -->
      <b-form-group v-if="field.type === 'text'" :label="`${field.label}:`" :label-for="field.name">
        <b-form-input 
          :id="field.name" 
          v-model="formData[field.name]" 
          type="text" 
          :required="field.required !== false"
        ></b-form-input>
      </b-form-group>

      <!-- Renderiza un input numérico -->
      <b-form-group v-if="field.type === 'number'" :label="`${field.label}:`" :label-for="field.name">
        <b-form-input 
          :id="field.name" 
          v-model.number="formData[field.name]" 
          type="number" 
          step="any" 
          :required="field.required !== false"
        ></b-form-input>
      </b-form-group>

      <!-- Renderiza un checkbox con formato de 'switch' -->
      <b-form-group v-if="field.type === 'checkbox'">
        <b-form-checkbox 
          v-model="formData[field.name]" 
          switch
        >
          {{ field.label }}
        </b-form-checkbox>
      </b-form-group>

      <!-- Renderiza un selector (dropdown) -->
      <b-form-group v-if="field.type === 'select'" :label="`${field.label}:`" :label-for="field.name">
        <b-form-select 
          :id="field.name" 
          v-model="formData[field.name]" 
          :options="selectOptions[field.name] || field.options" 
          :required="field.required !== false"
        ></b-form-select>
      </b-form-group>

    </div>

    <hr />

    <!-- Botones de acción del formulario -->
    <div class="d-flex justify-content-end">
      <b-button type="button" variant="secondary" @click="$emit('cancel')" class="me-2">Cancel</b-button>
      <b-button type="submit" variant="primary">Save</b-button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// --- DEFINICIÓN DE PROPS Y EMITS ---
const props = defineProps({
  // 'fields': La configuración que define qué campos mostrar en el formulario.
  fields: { 
    type: Array, 
    required: true 
  },
  // 'initialData': Los datos existentes para rellenar el formulario en modo de edición.
  // Si es null, el formulario estará en modo de creación.
  initialData: { 
    type: Object, 
    default: null 
  },
});

// El componente puede emitir dos eventos hacia su padre:
// 'submit' con los datos del formulario, y 'cancel'.
const emit = defineEmits(['submit', 'cancel']);


// --- ESTADO REACTIVO ---
// 'formData' almacenará los valores actuales de los campos del formulario.
const formData = ref({});
// 'selectOptions' almacenará las opciones para los campos de tipo 'select' que se cargan desde una API.
const selectOptions = ref({});


// --- LÓGICA DEL COMPONENTE ---
// Función para inicializar o resetear el estado del formulario.
async function initializeForm() {
  const data = {};
  const options = {};
  
  for (const field of props.fields) {
    // 1. Establece el valor inicial para cada campo:
    //    - Primero intenta usar el valor de 'initialData' (modo edición).
    //    - Si no existe, intenta usar el 'defaultValue' de la configuración del campo.
    //    - Si tampoco existe, lo deja como null.
    data[field.name] = props.initialData?.[field.name] ?? field.defaultValue ?? null;
    if (field.type === 'checkbox') {
      data[field.name] = props.initialData?.[field.name] ?? field.defaultValue ?? false;
    }
    
    // 2. Carga las opciones para los campos de tipo 'select' que lo requieran.
    if (field.type === 'select' && field.optionsApiMethod) {
      try {
        const response = await field.optionsApiMethod();
        // Mapea la respuesta de la API al formato que espera b-form-select.
        options[field.name] = [
          { value: null, text: `Select a ${field.label.toLowerCase()}`, disabled: true },
          ...response.data.map(item => ({ value: item.id, text: item[field.optionText] }))
        ];
      } catch (error) { 
        console.error(`Error loading options for ${field.name}:`, error); 
      }
    }
  }
  formData.value = data;
  selectOptions.value = options;
}

// 'watch' es un hook de Vue que observa cambios en una variable.
// Aquí, observa 'initialData'. Si cambia (por ejemplo, al abrir el modal para un item diferente),
// vuelve a ejecutar 'initializeForm' para refrescar el formulario.
// 'immediate: true' hace que se ejecute también la primera vez que el componente se monta.
watch(() => props.initialData, initializeForm, { immediate: true });

// Función que se ejecuta cuando el usuario envía el formulario.
function handleSubmit() {
  // Emite el evento 'submit' hacia el componente padre (ResourceView.vue),
  // pasándole los datos actuales del formulario.
  emit('submit', formData.value);
}
</script>