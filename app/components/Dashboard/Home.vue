<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard Home</h1>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded">
        <thead class="bg-gray-100">
          <tr>
            <th
              class="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"
            >
              ID
            </th>
            <th
              class="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"
            >
              Name
            </th>
            <th
              class="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"
            >
              Email
            </th>
            <th
              class="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b">1</td>
            <td class="px-4 py-2 border-b">John Doe</td>
            <td class="px-4 py-2 border-b">john@example.com</td>
            <td class="px-4 py-2 border-b">
              <button class="text-blue-600 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline ml-2">Delete</button>
            </td>
          </tr>
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>
  </div>
</template>
