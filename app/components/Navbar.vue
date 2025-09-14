<!-- eslint-disable vue/multi-word-component-names -->

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, BellIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "#imports";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { user, logout } = useAuth();

const signOut = () => {
  logout();
  router.push("/login");
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 relative">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <!-- Mobile menu button -->
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="block h-6 w-6" />
          </DisclosureButton>
        </div>

        <!-- Logo + Links -->
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0">
            <NuxtLink to="/">
              <img
                class="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Logo"
              />
            </NuxtLink>
          </div>

          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:ml-6 sm:pr-0"
        >
          <button
            class="relative rounded-full p-1 text-gray-400 hover:text-white"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" />
          </button>

          <!-- Profile / Login -->
          <Menu as="div" class="relative ml-3">
            <MenuButton class="relative flex rounded-full focus:outline-none">
              <!-- Logged in -->
              <template v-if="user">
                <img
                  v-if="user.image"
                  :src="user.image"
                  :alt="user.name"
                  class="h-8 w-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                />
                <span
                  v-else
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-sm font-medium text-white"
                >
                  {{ user.name?.charAt(0) || "U" }}
                </span>
              </template>

              <!-- Not logged in -->
              <template v-else>
                <span
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-sm font-medium text-white"
                >
                  🔑
                </span>
              </template>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <template v-if="user">
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-white/5' : '',
                        'w-full text-left px-4 py-2 text-sm text-gray-300',
                      ]"
                      @click="router.push('/profile')"
                    >
                      Your Profile
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-white/5' : '',
                        'w-full text-left px-4 py-2 text-sm text-gray-300',
                      ]"
                      @click="signOut"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </template>

                <template v-else>
                  <MenuItem>
                    <button
                      class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                      @click="router.push('/login')"
                    >
                      Login
                    </button>
                  </MenuItem>
                </template>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
