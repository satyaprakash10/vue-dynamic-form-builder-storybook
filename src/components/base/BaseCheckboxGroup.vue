<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue: string[];
  options: Option[];
  label?: string;
  required?: boolean;
  minSelected?: number;
  maxSelected?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const selected = ref<string[]>(props.modelValue || []);

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val || [];
  }
);

function toggleOption(val: string) {
  if (selected.value.includes(val)) {
    selected.value = selected.value.filter((v) => v !== val);
  } else {
    selected.value.push(val);
  }
  emit("update:modelValue", selected.value);
}

const error = computed(() => {
  const count = selected.value.length;
  if (props.minSelected && count < props.minSelected) {
    return `Select at least ${props.minSelected}`;
  }
  if (props.maxSelected && count > props.maxSelected) {
    return `Select at most ${props.maxSelected}`;
  }
  if (props.required && count === 0) {
    return "At least one option is required";
  }
  return "";
});
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-base font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          :value="opt.value"
          :checked="selected.includes(opt.value)"
          @change="toggleOption(opt.value)"
          class="w-4 h-4 text-indigo-600 border-gray-300 rounded hover:ring-2 hover:ring-indigo-300 focus:ring-indigo-500"
          :class="error ? 'border-red-500' : ''"
        />
        <span class="text-gray-700">{{ opt.label }}</span>
      </label>
    </div>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
