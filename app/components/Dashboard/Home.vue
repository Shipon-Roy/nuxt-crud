<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// PrimeVue
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";

// API Header Setup
axios.defaults.headers.common["Authorization"] =
  `Bearer ${import.meta.env.VITE_API_TOKEN}`;
axios.defaults.headers.common["X-Tenant"] = import.meta.env.VITE_TENANT_ID;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Reactive
const locations = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const first = ref(0);

const showForm = ref(false);
const formErrors = ref({});
const isEditing = ref(false);
const editingId = ref(null);

const newDepartment = ref({
  name: "",
  country_id: "",
  street: "",
  zip: "",
  city: "",
  parent_id: "",
  number: "",
  company: "",
  mail: "",
});

const fetchLocations = async (page = 1, perPage = 10) => {
  loading.value = true;
  try {
    const { data } = await axios.get(
      "https://my.1tool.com/suite/api/departments",
      {
        params: {
          include: "country,parent",
          sort: "name",
          page,
          per_page: perPage,
        },
      }
    );
    locations.value = data.data;
    totalRecords.value = data.meta?.total || data.total || 0;
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  formErrors.value = {};
  const url = isEditing.value
    ? `https://my.1tool.com/suite/api/departments/${editingId.value}`
    : "https://my.1tool.com/suite/api/departments";
  const method = isEditing.value ? "put" : "post";
  try {
    await axios({ method, url, data: newDepartment.value });
    resetForm();
    await fetchLocations(currentPage.value, rowsPerPage.value);
  } catch (error) {
    if (error.response?.status === 422)
      formErrors.value = error.response.data.errors || {};
  }
};

const deleteDepartment = async (id) => {
  if (!confirm("Are you sure you want to delete this department?")) return;
  await axios.delete(`https://my.1tool.com/suite/api/departments/${id}`);
  await fetchLocations(currentPage.value, rowsPerPage.value);
};

const editDepartment = (dept) => {
  newDepartment.value = { ...dept };
  editingId.value = dept.id;
  isEditing.value = true;
  showForm.value = true;
};

const resetForm = () => {
  showForm.value = false;
  isEditing.value = false;
  editingId.value = null;
  formErrors.value = {};
  newDepartment.value = {
    name: "",
    country_id: "",
    street: "",
    zip: "",
    city: "",
    parent_id: "",
    number: "",
    company: "",
    mail: "",
  };
};

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;
  first.value = event.first;
  fetchLocations(currentPage.value, rowsPerPage.value);
};

onMounted(() => {
  fetchLocations(currentPage.value, rowsPerPage.value);
});
</script>

<template>
  <!-- wrapper: শুধু এই ব্লকের ভেতরে reset লাগবে -->
  <div class="one-tool-wrapper flex flex-col h-screen p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Department List</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="() => (showForm ? resetForm() : (showForm = true))"
      >
        {{ showForm ? "Cancel" : "Add New" }}
      </button>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-opacity-30" @click="resetForm" />
      <div class="relative w-full sm:w-96 h-full bg-white shadow-xl">
        <div class="p-6 overflow-y-auto h-full">
          <h2 class="text-xl font-semibold mb-4">
            {{ isEditing ? "Edit Department" : "Add New Department" }}
          </h2>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div v-for="(value, key) in newDepartment" :key="key">
              <label class="block text-sm font-medium mb-1 capitalize">
                {{ key.replace("_", " ") }}
              </label>
              <input
                v-model="newDepartment[key]"
                :type="key === 'mail' ? 'email' : 'text'"
                class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p v-if="formErrors[key]" class="text-sm text-red-600 mt-1">
                {{ formErrors[key][0] }}
              </p>
            </div>

            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {{ isEditing ? "Update" : "Submit" }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <div v-if="loading" class="space-y-4 mb-4 grow overflow-auto">
      <div v-for="i in 10" :key="i" class="flex space-x-4">
        <Skeleton width="3rem" height="2rem" />
        <Skeleton width="10rem" height="2rem" />
        <Skeleton width="12rem" height="2rem" />
      </div>
    </div>
    <DataTable
      :value="locations"
      :lazy="true"
      :first="first"
      :rows="rowsPerPage"
      :total-records="totalRecords"
      paginator
      paginator-position="bottom"
      responsive-layout="scroll"
      :rows-per-page-options="[10, 25, 50]"
      paginator-template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      current-page-report-template="Showing {first} to {last} of {totalRecords}"
      class="flat-datatable border-none"
      table-class="no-border-table "
      :pt="{
        /* 1) Hard override via pt */
        root: {
          style: 'border:none; background:transparent; box-shadow:none',
        },
        table: { style: 'border:none' },
        header: { style: 'border:none; background:transparent' },
        headerCell: { style: 'border:none' },
        bodyCell: { style: 'border:none' },
        footer: { style: 'border:none; background:transparent' },
        paginator: {
          style:
            'border:none; background:transparent; box-shadow:none; padding-top:8px',
        },
        paginatorElement: {
          style: 'border:none; background:transparent; box-shadow:none',
        },
        paginatorPage: { class: 'pg-page' },
      }"
      @page="onPageChange"
      @update:first="(val) => (first = val)"
      @update:rows="(val) => (rowsPerPage = val)"
    >
      <Column header="Action" style="width: 120px">
        <template #body="slotProps">
          <button
            class="text-blue-600 hover:text-blue-800 mr-2"
            @click="editDepartment(slotProps.data)"
          >
            <i class="pi pi-pencil" />
          </button>
          <button
            class="text-red-600 hover:text-red-800 mr-2"
            @click="deleteDepartment(slotProps.data.id)"
          >
            <i class="pi pi-trash" />
          </button>
          <button class="text-gray-600 hover:text-gray-800">
            <i class="pi pi-envelope" />
          </button>
        </template>
      </Column>

      <Column field="mail" header="E-mail" />
      <Column field="country.name" header="Country" />
      <Column field="company" header="Company" />
      <Column field="city" header="City" />
      <Column field="street" header="Street" />
      <Column field="name" header="Name" sortable />
      <Column field="zip" header="ZIP" />
      <Column field="number" header="Number" />
      <Column field="parent.name" header="Parent" />
    </DataTable>
  </div>
</template>

<style scoped>
/* Table collapse করতে হবে */
:deep(.p-datatable-table) {
  border-collapse: collapse !important;
  width: 100%;
  border: 1px solid #d1d5db !important;
}

/* Header row -> নিচে border */
:deep(.p-datatable thead th) {
  border-bottom: 1px solid #d1d5db !important;
  border-left: none !important;
  border-right: none !important;
  padding: 10px 12px;
  text-align: left;
  background: #f9fafb;
  font-weight: 600;
}

/* Body row -> নিচে border */
:deep(.p-datatable tbody td) {
  border-bottom: 1px solid #e5e7eb !important;
  border-left: none !important;
  border-right: none !important;
  padding: 8px 12px;
}

/* paginator wrapper (nav) এর border কেটে দিন */
:deep(.p-datatable-paginator-bottom) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  margin: 20px 0;
}

/* 🔹 dropdown সবসময় left এ */
:deep(.p-paginator-rpp-dropdown) {
  border: 1px solid rgb(0, 119, 255);
  padding: 4px 10px;
  border-radius: 6px;
  gap: 5px;
}
:deep(.p-paginator-content) {
  gap: 20px;
}
:deep(.p-paginator-pages) {
  gap: 10px;
}
</style>
