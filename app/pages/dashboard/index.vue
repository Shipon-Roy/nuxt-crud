<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup>
import DashboardHome from "~/components/Dashboard/DashboardHome.vue";

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <DashboardHome />
</template>
