<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  id: String,
  name: String,
  type: { type: String, default: "text" },
  error: String,
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue || "");

// keep internal in sync when parent updates
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val ?? "";
  }
);

function updateValue(e: Event) {
  let val = (e.target as HTMLInputElement).value;

  // handle number & phone subtype validation
  if (props.type === "number") {
    val = val.replace(/\D/g, "");
  }

  internalValue.value = val;
  emit("update:modelValue", val);
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="mb-1 text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <!-- Input -->
    <input
      :id="id || ''"
      :name="name || ''"
      :type="type || 'text'"
      :placeholder="placeholder || ''"
      :value="internalValue"
      @input="updateValue"
      :disabled="disabled"
      :class="[
        'w-full p-3 transition duration-200 ease-in-out border rounded-lg shadow-md focus:outline-none',
        disabled
          ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-60'
          : 'border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:bg-gray-50 cursor-text',
      ]"
    />

    <!-- Error -->
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
