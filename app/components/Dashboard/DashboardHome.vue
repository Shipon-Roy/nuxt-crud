<script setup>
import { ref, computed } from "vue";
import Home from "./Home.vue";
import Users from "./Users.vue";
import Settings from "./Settings.vue";
import Sidebar from "./Sidebar.vue";

const menuItems = ["Home", "Users", "Settings"];
const selected = ref("Home");

const selectedComponent = computed(() => {
  switch (selected.value) {
    case "Home":
      return Home;
    case "Users":
      return Users;
    case "Settings":
      return Settings;
    default:
      return Home;
  }
});
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar
      :items="menuItems"
      :selected="selected"
      @update:selected="selected = $event"
    />

    <main class="flex-1 p-8">
      <component :is="selectedComponent" />
    </main>
  </div>
</template>
