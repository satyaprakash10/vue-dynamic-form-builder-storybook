<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  label: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const open = ref(false);

function toggleDropdown() {
  open.value = !open.value;
}

function selectOption(option: { label: string; value: string }) {
  emit("update:modelValue", option.value);
  open.value = false;
}
</script>

<template>
  <div class="relative w-full dropdown-wrapper">
    <label
      v-if="props.label"
      class="block mb-1 text-sm font-medium text-gray-700"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full p-3 text-gray-500 transition duration-200 ease-in-out border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
    >
      <span>{{
        props.modelValue
          ? props.options.find((o) => o.value === props.modelValue)?.label
          : props.placeholder
      }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>

    <transition name="fade">
      <div
        v-if="open"
        class="absolute z-10 w-full mt-1 overflow-auto transition-all duration-300 ease-in-out transform bg-white border border-gray-300 rounded-lg shadow-md max-h-60"
      >
        <div
          v-for="opt in props.options"
          :key="opt.value"
          @click="selectOption(opt)"
          class="p-2 text-gray-500 transition duration-150 ease-in-out cursor-pointer hover:bg-gray-200"
        >
          {{ opt.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
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
