<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from "vue";

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
const rootEl = ref<HTMLElement | null>(null);

function toggleDropdown() {
  open.value = !open.value;
}

function selectOption(option: { label: string; value: string }) {
  emit("update:modelValue", option.value);
  open.value = false;
}

function clearValue() {
  emit("update:modelValue", "");
  open.value = false;
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as Node | null;
  if (!rootEl.value || !target) return;
  if (!rootEl.value.contains(target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
  <div ref="rootEl" class="relative w-full dropdown-wrapper">
    <label
      v-if="props.label"
      class="block mb-1 text-sm font-medium text-gray-700"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full p-3 text-gray-700 transition duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
    >
      <span class="truncate">{{
        props.modelValue
          ? props.options.find((o) => o.value === props.modelValue)?.label
          : props.placeholder
      }}</span>
      <div class="flex items-center gap-2">
        <button
          v-if="props.modelValue"
          type="button"
          @click.stop="clearValue"
          class="grid w-5 h-5 -mt-1 text-gray-400 transition rounded cursor-pointer hover:text-gray-600 hover:bg-gray-100 place-items-center"
          title="Clear"
          aria-label="Clear"
        >
          ×
        </button>
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
    </div>

    <transition name="menu" appear>
      <div
        v-if="open"
        class="absolute z-10 w-full p-1 mt-1 overflow-auto transition-all duration-200 ease-out transform bg-white border border-gray-200 shadow-xl rounded-xl max-h-60"
      >
        <div
          v-for="opt in props.options"
          :key="opt.value"
          @click="selectOption(opt)"
          class="p-2 text-sm text-gray-700 transition duration-150 ease-in-out rounded cursor-pointer hover:bg-gray-100"
        >
          {{ opt.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.menu-enter-active,
.menu-leave-active {
  transition: all 140ms ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
