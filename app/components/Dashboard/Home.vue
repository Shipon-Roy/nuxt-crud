<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Setup API headers globally
axios.defaults.headers.common["Authorization"] =
  `Bearer ${import.meta.env.VITE_API_TOKEN}`;
axios.defaults.headers.common["X-Tenant"] = import.meta.env.VITE_TENANT_ID;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// ✅ Debug log to check token is available
console.log("API Token:", import.meta.env.VITE_API_TOKEN || "NOT SET");

const locations = ref([]);
const loading = ref(true);
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

const fetchLocations = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      "https://my.1tool.com/suite/api/departments",
      {
        params: {
          include: "country,parent",
          sort: "name",
        },
      }
    );
    locations.value = response.data.data;
  } catch (error) {
    console.error("API fetch failed:", error.response?.status, error.message);
    if (error.response?.status === 401) {
      alert("Unauthorized: Please check your API token or login credentials.");
    }
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
    await axios({
      method,
      url,
      data: newDepartment.value,
    });

    resetForm();
    await fetchLocations();
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

const deleteDepartment = async (id) => {
  if (!confirm("Are you sure you want to delete this department?")) return;

  try {
    await axios.delete(`https://my.1tool.com/suite/api/departments/${id}`);
    await fetchLocations();
  } catch (error) {
    console.error("Delete failed:", error.message);
    alert("Failed to delete department.");
  }
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

onMounted(fetchLocations);
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

    <!-- Slide-in Sidebar Form -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-opacity-30" @click="resetForm" />
      <div
        class="relative w-full sm:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      >
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

    <!-- Table -->
    <div v-if="loading">Loading...</div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border-b text-left">ID</th>
            <th class="px-4 py-2 border-b text-left">Name</th>
            <th class="px-4 py-2 border-b text-left">Email</th>
            <th class="px-4 py-2 border-b text-left">Company</th>
            <th class="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="location in locations"
            :key="location.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border-b">{{ location.id }}</td>
            <td class="px-4 py-2 border-b">{{ location.name }}</td>
            <td class="px-4 py-2 border-b">{{ location.mail }}</td>
            <td class="px-4 py-2 border-b">{{ location.company }}</td>
            <td class="px-4 py-2 border-b">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-800"
                  title="Edit"
                  @click="editDepartment(location)"
                >
                  ✏️
                </button>
                <button
                  class="text-red-600 hover:text-red-800"
                  title="Delete"
                  @click="deleteDepartment(location.id)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
