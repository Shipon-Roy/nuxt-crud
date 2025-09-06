<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// PrimeVue
import Skeleton from "primevue/skeleton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

// API Header Setup
axios.defaults.headers.common["Authorization"] =
  `Bearer ${import.meta.env.VITE_API_TOKEN}`;
axios.defaults.headers.common["X-Tenant"] = import.meta.env.VITE_TENANT_ID;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Reactive Variables
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

// Fetch Department List
const fetchLocations = async (page = 1, perPage = 10) => {
  loading.value = true;
  try {
    const response = await axios.get(
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

    locations.value = response.data.data;

    if (response.data.meta?.total) {
      totalRecords.value = response.data.meta.total;
    } else if (response.data.total) {
      totalRecords.value = response.data.total;
    } else {
      totalRecords.value = (page - 1) * perPage + locations.value.length;
    }
  } catch (error) {
    console.error("API fetch failed:", error.response?.status, error.message);
  } finally {
    loading.value = false;
  }
};

// Form Submission
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
    if (error.response?.status === 422) {
      formErrors.value = error.response.data.errors || {};
    } else if (error.response?.status === 401) {
      alert("Unauthorized: Please check your API token.");
    } else {
      console.error("Form submit failed:", error.message);
    }
  }
};

// Delete Department
const deleteDepartment = async (id) => {
  if (!confirm("Are you sure you want to delete this department?")) return;

  try {
    await axios.delete(`https://my.1tool.com/suite/api/departments/${id}`);
    await fetchLocations(currentPage.value, rowsPerPage.value);
  } catch (error) {
    console.error("Delete failed:", error.message);
    alert("Failed to delete department.");
  }
};

// Edit Department
const editDepartment = (dept) => {
  newDepartment.value = { ...dept };
  editingId.value = dept.id;
  isEditing.value = true;
  showForm.value = true;
};

// Reset Form
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

// Handle Pagination
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
  <div class="relative p-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Department List</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="() => (showForm ? resetForm() : (showForm = true))"
      >
        {{ showForm ? "Cancel" : "Add New" }}
      </button>
    </div>

    <!-- Sidebar Form -->
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

    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-4 mb-4">
      <div v-for="i in 10" :key="i" class="flex space-x-4">
        <Skeleton width="3rem" height="2rem" />
        <Skeleton width="10rem" height="2rem" />
        <Skeleton width="12rem" height="2rem" />
        <Skeleton width="8rem" height="2rem" />
        <Skeleton width="6rem" height="2rem" />
      </div>
    </div>

    <!-- DataTable -->
    <DataTable
      :value="locations"
      :lazy="true"
      :first="first"
      :rows="rowsPerPage"
      :total-records="totalRecords"
      paginator
      paginator-position="bottom"
      paginator-template="Custom"
      responsive-layout="scroll"
      class="p-datatable-sm border border-gray-300 rounded-md shadow-sm p-5 mb-10"
      :pt="{
        paginator: {
          root: { class: 'border-none shadow-none p-0 m-0 bg-transparent' },
        },
      }"
      @page="onPageChange"
      @update:first="(val) => (first = val)"
      @update:rows="(val) => (rowsPerPage = val)"
    >
      <!-- Columns -->
      <Column field="id" header="ID" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="mail" header="Email" />
      <Column field="company" header="Company" />

      <!-- Actions -->
      <Column header="Actions" :style="{ width: '120px' }">
        <template #body="slotProps">
          <button
            class="text-blue-600 hover:text-blue-800 mr-2"
            title="Edit"
            @click="editDepartment(slotProps.data)"
          >
            <i class="pi pi-pencil" />
          </button>
          <button
            class="text-red-600 hover:text-red-800"
            title="Delete"
            @click="deleteDepartment(slotProps.data.id)"
          >
            <i class="pi pi-trash" />
          </button>
        </template>
      </Column>
      <template
        #paginatorcontainer="{
          first,
          last,
          page,
          pageCount,
          prevPageCallback,
          nextPageCallback,
          totalRecords,
        }"
      >
        <div
          class="flex items-center gap-4 border border-blue-500 bg-white shadow-sm rounded-full px-4 py-2 w-full justify-between"
        >
          <Button
            icon="pi pi-chevron-left"
            rounded
            text
            :disabled="page === 0"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
            @click="prevPageCallback"
          />
          <div class="text-color font-medium">
            <span class="hidden sm:block"
              >Showing {{ first }} to {{ last }} of {{ totalRecords }}</span
            >
            <span class="block sm:hidden"
              >Page {{ page + 1 }} of {{ pageCount }}</span
            >
          </div>
          <Button
            icon="pi pi-chevron-right"
            rounded
            text
            :disabled="page === pageCount - 1"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
            @click="nextPageCallback"
          />
        </div>
      </template>
    </DataTable>

    <!-- Debug Info -->
    <div class="mb-2 text-sm text-gray-600">
      Page: {{ currentPage }} | First: {{ first }} | Rows per Page:
      {{ rowsPerPage }} | Total: {{ totalRecords }}
    </div>
  </div>
</template>
