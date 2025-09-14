<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const email = ref("");
const password = ref("");
const router = useRouter();
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push("/"); // login success হলে homepage এ redirect করবে
  } else {
    alert("Login failed! Please check your credentials.");
  }
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      class="bg-white p-6 rounded shadow w-full max-w-md"
      @submit.prevent="handleLogin"
    >
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  </div>
</template>
