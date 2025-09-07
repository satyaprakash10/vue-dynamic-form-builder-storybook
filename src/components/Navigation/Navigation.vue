<template>
  <nav
    class="mt-4 bg-white border shadow-2xl rounded-2xl border-slate-300 w-full"
  >
    <div class="px-4 sm:px-6 lg:px-8 w-full">
      <div class="flex justify-between h-16">
        <!-- Logo (SVG) -->
        <div class="flex items-center">
          <svg
            class="w-10 h-10 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5-2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5z"
            />
          </svg>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex md:items-center md:space-x-6">
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            class="text-gray-700 transition hover:text-indigo-600"
            >{{ link.name }}</a
          >
          <a
            href="/storybook"
            target="_blank"
            rel="noopener"
            class="px-3 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >Storybook</a
          >

          <!-- Profile Dropdown -->
          <div class="relative" @mouseleave="profileOpen = false">
            <button
              @click="toggleProfile"
              class="flex items-center gap-2 px-3 py-1 text-gray-700 rounded hover:bg-gray-100"
            >
              <img
                :src="profile.avatar"
                alt="Profile"
                class="w-8 h-8 rounded-full"
              />
              <span>{{ profile.name }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': profileOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition name="fade">
              <div
                v-if="profileOpen"
                class="absolute right-0 z-10 w-48 py-2 mt-2 bg-white border rounded shadow-lg border-slate-300"
              >
                <a
                  v-for="item in profileMenu"
                  :key="item.name"
                  :href="item.href"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >{{ item.name }}</a
                >
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex items-center md:hidden">
          <button
            @click="mobileOpen = !mobileOpen"
            class="text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <svg
              v-if="!mobileOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div v-if="mobileOpen" class="md:hidden">
        <div
          class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-300 rounded-b-2xl"
        >
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            class="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 hover:text-indigo-500"
            >{{ link.name }}</a
          >
          <a
            href="/storybook"
            target="_blank"
            rel="noopener"
            class="block px-3 py-2 mt-1 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >Storybook</a
          >
          <div class="pt-2 mt-2 border-t border-slate-300">
            <a
              v-for="item in profileMenu"
              :key="item.name"
              :href="item.href"
              class="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 hover:text-indigo-500"
              >{{ item.name }}</a
            >
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

const links = [
  { name: "Home", href: "#" },
  { name: "About", href: "#" },
  { name: "Services", href: "#" },
  { name: "Contact", href: "#" },
];

const profile = {
  name: "John Doe",
  avatar: "https://i.pravatar.cc/150?img=32",
};

const profileMenu = [
  { name: "Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Logout", href: "#" },
];

const profileOpen = ref(false);
const mobileOpen = ref(false);

function toggleProfile() {
  profileOpen.value = !profileOpen.value;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
