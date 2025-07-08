<!-- frontend/src/components/AdvancedDataTable.vue -->
<template>
  <div class="advanced-data-table">
    <b-table
      striped hover responsive sticky-header="calc(100vh - 250px)"
      :items="filteredItems" :fields="fields" :busy="isLoading"
      @row-clicked="onRowClicked"
    >
      <template #table-busy>
        <div class="text-center my-2"><b-spinner></b-spinner></div>
      </template>

      <template #thead-top>
        <tr class="table-filters bg-light">
          <th v-for="field in fields" :key="`filter-${field.key}`">
            <div v-if="field.filterable">
              <!-- Filtro de Texto -->
              <b-form-input v-if="field.filter?.type === 'text' || !field.filter"
                v-model="filters[field.key]" size="sm" placeholder="Search..." />
              
              <!-- Filtro de Selección -->
              <b-form-select v-if="field.filter?.type === 'select'"
                v-model="filters[field.key]" size="sm" :options="field.filter.options">
                <template #first><b-form-select-option :value="null">All</b-form-select-option></template>
              </b-form-select>
            </div>
          </th>
        </tr>
      </template>

      <!-- Slots para renderizado personalizado de celdas -->
      <template v-for="field in fields" v-slot:[`cell(${field.key})`]="data">
        <slot :name="`cell-${field.key}`" :item="data.item" :value="data.value">
          {{ data.value }}
        </slot>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  fields: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(['row-clicked']);

const filters = ref({});

const filteredItems = computed(() => {
  let data = [...props.items];
  for (const key in filters.value) {
    const filterValue = filters.value[key];
    if (filterValue) {
      data = data.filter(item => {
        const itemValue = item[key];
        if (itemValue === null || itemValue === undefined) return false;
        return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    }
  }
  return data;
});

function onRowClicked(item, index, event) {
  emit('row-clicked', item);
}
</script>

<style scoped>
.advanced-data-table {
  height: 100%;
}
.table-filters th {
  padding: 0.5rem;
  vertical-align: middle;
}
:deep(tbody tr) {
  cursor: pointer;
}
</style>