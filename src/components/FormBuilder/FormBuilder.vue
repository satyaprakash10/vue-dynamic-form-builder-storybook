<template>
  <div class="w-full max-w-4xl p-0 mx-auto space-y-6 sm:p-6">
    <h2
      class="py-4 mb-4 text-2xl font-bold text-gray-800 border-b border-slate-300 sm:mb-8"
    >
      {{ title }}
    </h2>

    <!-- Forms Toolbar -->
    <div
      class="gap-3 p-2 bg-white border rounded-lg shadow-lg border-slate-300"
    >
      <div class="items-center inline-block w-full mb-6 sm:flex">
        <div
          class="flex justify-center w-full mt-3 space-x-5 sm:justify-center sm:mt-0"
        >
          <button
            type="button"
            @click="handleUndo"
            :disabled="!canUndo"
            class="w-auto px-3 py-1 transition bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
          >
            Undo
          </button>

          <button
            type="button"
            @click="handleRedo"
            :disabled="!canRedo"
            class="px-3 py-1 transition bg-gray-200 rounded-lg hover:bg-gray-400 disabled:opacity-40"
          >
            Redo
          </button>
        </div>

        <div
          class="flex justify-center w-full mt-3 space-x-5 sm:justify-start sm:mt-0"
        >
          <button
            type="button"
            @click="handleSave"
            class="flex items-center gap-2 px-3 py-1 text-white transition bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700"
          >
            <svg
              v-if="formState.isSaving.value"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{{
              formState.isSaving.value ? "Saving..." : "Save Draft"
            }}</span>
          </button>

          <button
            type="button"
            @click="discardDraft"
            class="px-3 py-1 ml-2 text-sm text-red-600 transition rounded bg-red-50 hover:bg-red-100"
          >
            Discard Draft
          </button>
        </div>
      </div>

      <div
        class="p-1 mt-2 ml-auto text-xs italic text-gray-500 bg-green-100 sm:text-sm sm:mt-0"
      >
        <span v-if="isDirty">● Unsaved changes</span>
        <span v-else>✔ All saved</span>
        <span v-if="formState.lastSaved.value">
          — last saved {{ formatDateTime(formState.lastSaved.value) }}
        </span>
      </div>
    </div>

    <!-- Form (with loading overlay) -->
    <div class="relative">
      <div
        :class="isLoading ? 'pointer-events-none opacity-60' : ''"
        class="transition-opacity"
      >
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Default Fields -->
          <div v-for="field in fields" :key="field.id">
            <BaseTextField
              v-if="['text', 'number'].includes(field.type)"
              v-model="formData[field.name]"
              :label="field.label"
              :placeholder="field.placeholder"
              :type="field.type === 'number' ? 'number' : 'text'"
              :id="field.name"
              :name="field.name"
            />

            <BaseSelectField
              v-else-if="field.type === 'select'"
              v-model="formData[field.name]"
              :options="field.options || []"
              :multiple="field.multiple"
              :allowCustom="field.allowCustom"
              :placeholder="field.placeholder || field.label"
              :label="field.label"
            />

            <BaseCheckboxGroup
              v-else-if="field.type === 'checkbox-group'"
              v-model="formData[field.name]"
              :options="field.options || []"
              :label="field.label"
              :min-selected="field.minSelected"
              :max-selected="field.maxSelected"
              :required="true"
            />

            <BaseDateField
              v-else-if="field.type === 'date'"
              v-model="formData[field.name]"
              :label="field.label"
              :placeholder="field.placeholder || field.label"
              :min-date="coerceDate(field.minDate)"
              :max-date="coerceDate(field.maxDate)"
              :future-only="field.futureOnly"
            />

            <p v-if="errors[field.name]" class="mt-1 text-sm text-red-500">
              {{ errors[field.name] }}
            </p>
          </div>

          <!-- Custom Fields -->
          <transition-group name="fade" tag="div" class="space-y-4">
            <h3
              v-if="customFields.length"
              class="pt-4 mt-8 text-lg font-semibold text-gray-700 border-t border-slate-300"
            >
              Custom Fields
            </h3>

            <div
              v-for="field in customFields"
              :key="field.id"
              class="p-4 border rounded-lg border-slate-300 bg-gray-50"
            >
              <label
                v-if="field.label"
                class="block mb-1 text-base font-medium text-gray-700"
              >
                {{ field.label }}
              </label>

              <BaseTextField
                v-if="['text', 'number'].includes(field.type)"
                v-model="formData[field.name]"
                :label="field.label"
                :placeholder="field.placeholder"
                :type="field.type === 'number' ? 'number' : 'text'"
                :id="field.name"
                :name="field.name"
              />

              <BaseSelectField
                v-else-if="field.type === 'select'"
                v-model="formData[field.name]"
                :options="field.options || []"
                :multiple="field.multiple"
                :allowCustom="field.allowCustom"
                :placeholder="field.placeholder || field.label"
                :label="field.label"
              />

              <BaseDropdown
                v-else-if="field.type === 'dropdown'"
                v-model="formData[field.name]"
                :options="field.options ?? []"
                :placeholder="field.placeholder || field.label"
                :label="field.label || 'Dropdown'"
              />

              <BaseCheckboxGroup
                v-else-if="field.type === 'checkbox-group'"
                v-model="formData[field.name]"
                :options="field.options || []"
                :label="field.label"
              />

              <div v-else-if="field.type === 'radio'" class="flex gap-2 mt-1">
                <label
                  v-for="opt in field.options"
                  :key="opt.value"
                  class="flex items-center gap-1"
                >
                  <input
                    type="radio"
                    :name="field.name"
                    :value="opt.value"
                    v-model="formData[field.name]"
                    class="form-radio"
                  />
                  {{ opt.label }}
                </label>
              </div>

              <BaseDateField
                v-else-if="field.type === 'date'"
                v-model="formData[field.name]"
                :label="field.label"
                :placeholder="field.placeholder || field.label"
                :min-date="coerceDate(field.minDate)"
                :max-date="coerceDate(field.maxDate)"
                :future-only="field.futureOnly"
              />

              <p v-if="errors[field.name]" class="mt-1 text-sm text-red-500">
                {{ errors[field.name] }}
              </p>
            </div>
          </transition-group>

          <button
            type="submit"
            :disabled="isSubmitting || isLoading"
            class="flex items-center gap-2 px-4 py-2 mt-2 text-white transition bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isSubmitting || isLoading"
              class="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{{
              isSubmitting || isLoading ? "Submitting..." : "Submit"
            }}</span>
          </button>
        </form>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 grid place-items-center">
        <div
          class="flex items-center gap-2 px-3 py-2 text-sm text-white rounded bg-black/50"
        >
          <svg
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke-width="4"
              class="opacity-25"
            />
            <path d="M4 12a8 8 0 018-8" stroke-width="4" class="opacity-75" />
          </svg>
          Loading...
        </div>
      </div>
    </div>

    <!-- Add Custom Field -->
    <transition name="fade-scale">
      <div
        v-if="showCustomFieldsVal"
        id="custom-form-section"
        class="max-w-4xl p-3 mt-6 space-y-4 bg-white border rounded-lg shadow-lg sm:p-6 border-slate-300"
      >
        <h3 class="mb-2 text-lg font-semibold text-gray-800">
          Add Custom Field
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label for="newFieldLabel">Field Label</label>
            <input
              v-model="newFieldLabel"
              placeholder="Field Label"
              class="w-full h-12 p-3 bg-gray-100 border rounded-lg shadow-xl cursor-pointer sm:w-auto hover:bg-gray-300 border-slate-300 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label for="newFieldLabel">Field Name</label>

            <input
              v-model="newFieldName"
              placeholder="Field Name"
              class="w-full h-12 p-3 bg-gray-100 border rounded-lg shadow-xl cursor-pointer sm:w-auto hover:bg-gray-300 border-slate-300 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <BaseDropdown
            v-model="newFieldType"
            :options="fieldTypeOptions"
            placeholder="Select Field Type"
            label="Field Type"
            class="w-full"
          />
        </div>

        <transition name="fade">
          <div
            v-if="
              ['select', 'checkbox-group', 'radio', 'dropdown'].includes(
                newFieldType
              )
            "
            class="p-3 mt-3 space-y-2 bg-gray-200 border rounded-lg shadow-md cursor-pointer shadow-xl-slate-300"
          >
            <DynamicOptionsInput v-model="newFieldOptions" />
          </div>
        </transition>

        <button
          @click="addCustomField"
          class="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          Add Field
        </button>
      </div>
    </transition>

    <!-- Debug FormData -->
    <div class="p-4 mt-4 bg-gray-100 border-t-1 border-slate-300">
      <h6 class="text-sm font-bold text-gray-700">Form Data</h6>
      <pre class="p-2 mt-2 overflow-x-auto text-xs bg-white rounded-lg">{{
        formData
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  onMounted,
  watch,
  onBeforeUnmount,
} from "vue";
import BaseTextField from "../../components/base/BaseTextField.vue";
import BaseSelectField from "../../components/base/BaseSelectField.vue";
import BaseCheckboxGroup from "../../components/base/BaseCheckboxGroup.vue";
import BaseDateField from "../../components/base/BaseDateField.vue";
import DynamicOptionsInput from "../../components/DynamicOptionsInput.vue";
import BaseDropdown from "../../components/base/BaseDropdown.vue";
import { useToast } from "../../composables/toast";
import { useFormValidation } from "../../composables/useFormValidation";
import { useFormState } from "../../composables/useFormState";

const props = defineProps<{
  title?: string;
  loading?: boolean;
  showCustomFields?: boolean;
  enableCustomFieldBuilder?: boolean;
}>();
const title = computed(() => props.title ?? "Dynamic Form Builder");
const isLoading = computed(() => !!props.loading);
const showCustomFieldsVal = computed(
  () =>
    props.showCustomFields === true || props.enableCustomFieldBuilder === true
);

const toast = useToast();

// --- Form fields ---
interface FormField {
  id: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  allowCustom?: boolean;
  // Date constraints
  minDate?: string | Date;
  maxDate?: string | Date;
  futureOnly?: boolean;
  // Checkbox constraints
  minSelected?: number;
  maxSelected?: number;
}

const formData = reactive<Record<string, any>>({});
const fields = reactive<FormField[]>([
  {
    id: "name",
    type: "text",
    name: "name",
    label: "Full Name",
    placeholder: "Enter your name",
  },
  {
    id: "gender",
    type: "select",
    name: "gender",
    label: "Gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  { id: "dob", type: "date", name: "dob", label: "Date of Birth" },
  {
    id: "subscribe",
    type: "checkbox-group",
    name: "subscribe",
    label: "Subscribe",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    minSelected: 1,
    maxSelected: 1,
  },
]);

const customFields = reactive<FormField[]>([]);

// Initialize default values
fields.forEach(
  (f) =>
    (formData[f.name] = ["checkbox-group"].includes(f.type)
      ? []
      : f.type === "date"
      ? null
      : "")
);

// --- Undo/Redo/Save ---
const AUTOSAVE_KEY = "my-form-draft";
const formState = useFormState(
  { formData, customFields },
  { autosaveKey: AUTOSAVE_KEY }
);

const canUndo = computed(() => formState.undoStack.value.length > 0);
const canRedo = computed(() => formState.redoStack.value.length > 0);
const isDirty = computed(() => formState.undoStack.value.length > 0);

// Submit loader state
const isSubmitting = ref(false);

// --- Validation ---
let schema: Record<
  string,
  { message: string; validator: (v: any) => boolean | Promise<boolean> }[]
> = {
  name: [
    { message: "Name is required", validator: (v: string) => !!v?.trim() },
  ],
  gender: [{ message: "Gender is required", validator: (v: string) => !!v }],
  dob: [{ message: "DOB required", validator: (v: string) => !!v }],
  subscribe: [
    {
      message: "You must select at least one option",
      validator: (v: any) => Array.isArray(v) && v.length > 0,
    },
  ],
};

function coerceDate(d?: string | Date): Date | undefined {
  if (!d) return undefined;
  if (d instanceof Date)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // Parse local YYYY-MM-DD to avoid UTC off-by-one
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  // Fallback for other string formats
  const dt = new Date(d);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function ensureFieldSchema(name: string) {
  if (!schema[name]) schema[name] = [];
}

// Date helpers for validation
function floorStartOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function parseLocalYYYYMMDD(v: string | null | undefined): Date | undefined {
  if (!v) return undefined;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return undefined;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Extend schema with per-field constraints
[...fields, ...customFields].forEach((f) => {
  // Date rules
  if (f.type === "date") {
    ensureFieldSchema(f.name);
    const minD = coerceDate(f.minDate);
    const maxD = coerceDate(f.maxDate);
    // Always prevent past dates from submission
    schema[f.name].push({
      message: "Please select today or a future date",
      validator: (v: string) => {
        const val = parseLocalYYYYMMDD(v);
        if (!val) return true;
        const today = floorStartOfDay(new Date());
        return floorStartOfDay(val) >= today;
      },
    });
    if (minD) {
      const minLocal = floorStartOfDay(minD);
      schema[f.name].push({
        message: `Please select on or after ${minLocal.toLocaleDateString()}`,
        validator: (v: string) => {
          const val = parseLocalYYYYMMDD(v);
          if (!val) return true;
          return floorStartOfDay(val) >= minLocal;
        },
      });
    }
    if (maxD) {
      const maxLocal = floorStartOfDay(maxD);
      schema[f.name].push({
        message: `Please select on or before ${maxLocal.toLocaleDateString()}`,
        validator: (v: string) => {
          const val = parseLocalYYYYMMDD(v);
          if (!val) return true;
          return floorStartOfDay(val) <= maxLocal;
        },
      });
    }
  }
  // Checkbox rules
  if (f.type === "checkbox-group") {
    ensureFieldSchema(f.name);
    if (typeof f.minSelected === "number") {
      schema[f.name].push({
        message: `Select at least ${f.minSelected}`,
        validator: (v: any) =>
          Array.isArray(v) ? v.length >= (f.minSelected as number) : false,
      });
    }
    if (typeof f.maxSelected === "number") {
      schema[f.name].push({
        message: `Select at most ${f.maxSelected}`,
        validator: (v: any) =>
          Array.isArray(v) ? v.length <= (f.maxSelected as number) : false,
      });
    }
  }
});

const { validate, errors } = useFormValidation(
  [...fields, ...customFields],
  formData,
  schema
);

// --- Custom Fields ---
const newFieldLabel = ref("");
const newFieldName = ref("");
const newFieldType = ref("");
const newFieldOptions = ref<{ label: string; value: string }[]>([]);
const fieldTypeOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Select", value: "select" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox", value: "checkbox-group" },
  { label: "Radio", value: "radio" },
  { label: "Date", value: "date" },
];

function addCustomField() {
  if (!newFieldLabel.value || !newFieldName.value || !newFieldType.value)
    return toast.error("Please fill all fields!");
  const id = Date.now().toString();
  const field: FormField = {
    id,
    type: newFieldType.value,
    name: newFieldName.value,
    label: newFieldLabel.value,
    placeholder: newFieldLabel.value,
    options: newFieldOptions.value.length
      ? [...newFieldOptions.value]
      : undefined,
    multiple: newFieldType.value === "select",
    allowCustom: newFieldType.value === "select",
  };
  customFields.push(field);
  formData[field.name] = ["checkbox-group"].includes(field.type)
    ? []
    : field.type === "date"
    ? null
    : "";
  formState.recordChange();
  toast.success("Custom field added!");
  newFieldLabel.value = newFieldName.value = newFieldType.value = "";
  newFieldOptions.value = [];
}

// --- Actions ---
function handleUndo() {
  formState.undo();
  toast.info("Undo applied");
}
function handleRedo() {
  formState.redo();
  toast.info("Redo applied");
}
async function handleSave() {
  await formState.saveDraft();
  toast.success("Draft saved!");
}
function discardDraft() {
  localStorage.removeItem(AUTOSAVE_KEY);
  toast.info("Draft discarded.");
}
function formatDateTime(ts: number | null) {
  return ts ? new Date(ts).toLocaleString() : "";
}
async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // Generic validation for custom fields (required non-empty)
    let customOk = true;
    customFields.forEach((f) => {
      const v = formData[f.name];
      const bad = Array.isArray(v) ? v.length === 0 : !v && v !== 0;
      if (bad) {
        // @ts-ignore - errors is reactive map from validation composable
        errors[f.name] = "This field is required";
        customOk = false;
      }
    });
    if (await validate()) {
      if (customOk) toast.success("Form submitted successfully!");
      else toast.error("Fix validation errors");
    } else {
      toast.error("Fix validation errors");
    }
    // small delay to surface loading spinner effect
    await new Promise((r) => setTimeout(r, 600));
  } finally {
    isSubmitting.value = false;
  }
}

// --- Autosave & Recovery (Undo/Redo friendly) ---
let autosaveTimer: any = null;
function scheduleAutosave() {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    // capture a snapshot for undo/redo and persist
    formState.recordChange();
    await formState.saveDraft();
  }, 500);
}

onMounted(() => {
  // Recover draft on reload if present
  formState.loadDraft();
});

watch(
  () => formData,
  () => scheduleAutosave(),
  { deep: true }
);

watch(
  () => customFields,
  () => scheduleAutosave(),
  { deep: true }
);

onBeforeUnmount(() => {
  if (autosaveTimer) clearTimeout(autosaveTimer);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(70px);
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.45s ease-in-out;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
