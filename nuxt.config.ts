import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: [
    "primevue/resources/themes/saga-blue/theme.css",
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
    "./main.css",
  ],

  build: {
    transpile: ["primevue"],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "nuxt-primevue",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  runtimeConfig: {
    public: {
      API_TOKEN: process.env.VITE_API_TOKEN || "",
      TENANT_ID: process.env.VITE_TENANT_ID || "",
    },
  },
});
