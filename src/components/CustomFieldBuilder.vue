<script setup lang="ts">
import { ref } from "vue";
import BaseTextField from "./base/BaseTextField.vue";
import BaseDropdown from "./base/BaseDropdown.vue";
import DynamicOptionsInput from "./DynamicOptionsInput.vue";
import { useToast } from "../composables/toast";

const toast = useToast();

const emit = defineEmits(["add-field"]);

const newFieldType = ref("");
const newFieldLabel = ref("");
const newFieldName = ref("");
const newFieldOptions = ref<{ label: string; value: string }[]>([]);

const fieldTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Number", value: "number" },
  { label: "Select", value: "select" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox Group", value: "checkbox-group" },
  { label: "Radio", value: "radio" },
  { label: "Date", value: "date" },
];

function addCustomField() {
  if (!newFieldLabel.value || !newFieldName.value || !newFieldType.value) {
    toast.error("Please fill all required fields!");
    return;
  }
  const field = {
    id: Date.now().toString(),
    type: newFieldType.value,
    name: newFieldName.value,
    label: newFieldLabel.value,
    placeholder: newFieldLabel.value,
    options: ["select", "dropdown", "checkbox-group", "radio"].includes(
      newFieldType.value
    )
      ? [...newFieldOptions.value]
      : undefined,
    multiple: newFieldType.value === "select",
    allowCustom: newFieldType.value === "select",
    required: true,
  };
  emit("add-field", field);
  toast.success("Custom field added!");

  // reset UI
  newFieldType.value = "";
  newFieldLabel.value = "";
  newFieldName.value = "";
  newFieldOptions.value = [];
}
</script>

<template>
  <div class="p-6 mt-6 shadow bg-gray-50 rounded-xl">
    <h3 class="mb-2 text-lg font-semibold">Add Custom Field</h3>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <BaseTextField v-model="newFieldLabel" placeholder="Field Label" />
      <BaseTextField v-model="newFieldName" placeholder="Field Name" />
      <BaseDropdown
        v-model="newFieldType"
        :options="fieldTypeOptions"
        placeholder="Select Field Type"
        label="Field Type"
      />
    </div>

    <div
      v-if="
        ['select', 'dropdown', 'checkbox-group', 'radio'].includes(newFieldType)
      "
      class="p-3 mt-3 bg-white rounded-lg"
    >
      <DynamicOptionsInput v-model="newFieldOptions" />
    </div>

    <button
      @click="addCustomField"
      class="px-4 py-2 mt-3 text-white bg-green-500 rounded hover:bg-green-600"
    >
      Add Field
    </button>
  </div>
</template>
