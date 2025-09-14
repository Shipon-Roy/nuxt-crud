<script setup>
import { onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const { user, fetchUser, logout } = useAuth();

onMounted(() => {
  fetchUser();
});
</script>
<template>
  <div class="p-6">
    <div v-if="user">
      <h1 class="text-2xl font-bold mb-4">User Info</h1>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <button
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        @click="logout"
      >
        Logout
      </button>
    </div>

    <div v-else>
      <p>please login and enjoy</p>
    </div>
  </div>
</template>
