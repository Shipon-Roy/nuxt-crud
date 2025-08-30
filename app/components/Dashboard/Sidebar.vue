<script setup>
const { items, selected } = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:selected"]);
</script>

<template>
  <aside class="w-64 bg-gray-100 p-4">
    <h2 class="text-xl font-bold mb-4">Menu</h2>
    <ul class="space-y-2">
      <li
        v-for="item in items"
        :key="item"
        :class="[
          'cursor-pointer p-2 rounded hover:bg-gray-200',
          selected === item ? 'bg-gray-300 font-semibold' : '',
        ]"
        @click="emit('update:selected', item)"
      >
        {{ item }}
      </li>
    </ul>
  </aside>
</template>
