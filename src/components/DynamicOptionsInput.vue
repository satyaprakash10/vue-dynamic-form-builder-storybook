<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: { label: string; value: string }[]): void;
}>();

const newOption = ref("");

function addOption() {
  if (!newOption.value.trim()) return;
  const option = { label: newOption.value, value: newOption.value };
  emit("update:modelValue", [...props.modelValue, option]);
  newOption.value = "";
}

function removeOption(index: number) {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit("update:modelValue", updated);
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <input
        v-model="newOption"
        type="text"
        placeholder="Add option"
        class="flex-1 p-2 transition duration-200 ease-in-out border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 cursor-text"
      />
      <button
        @click="addOption"
        type="button"
        class="px-4 py-2 text-white transition duration-200 ease-in-out bg-indigo-600 rounded-lg shadow cursor-pointer hover:bg-indigo-700"
      >
        Add
      </button>
    </div>
    <div v-if="props.modelValue.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="(opt, i) in props.modelValue"
        :key="i"
        class="flex items-center gap-1 px-3 py-1 text-indigo-800 transition transform bg-indigo-100 rounded-full shadow-md hover:scale-105"
      >
        {{ opt.label }}
        <button
          type="button"
          @click="removeOption(i)"
          class="ml-1 text-red-500 hover:text-red-700"
        >
          &times;
        </button>
      </span>
    </div>
  </div>
</template>
