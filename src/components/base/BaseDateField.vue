<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import Datepicker from "vuejs3-datepicker";

const props = defineProps<{
  modelValue: string | null;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  futureOnly?: boolean;
  clearable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

function floorStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function parseLocalYYYYMMDD(v: string): Date | undefined {
  const m = v?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return undefined;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function formatLocalYYYYMMDD(d?: Date | null): string | null {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

const internalDate = ref<Date | null>(null);
const lastValidDate = ref<Date | null>(null);
const error = ref<string>("");

const disabledDates = computed(() => {
  const today = floorStartOfDay(new Date());
  const cfg: any = { preventDisableDateSelection: false };

  // Block past dates if futureOnly
  if (props.futureOnly) {
    cfg.to = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );
  }

  if (props.minDate) {
    cfg.to = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate() - 1
    );
  }
  if (props.maxDate) {
    cfg.from = new Date(
      props.maxDate.getFullYear(),
      props.maxDate.getMonth(),
      props.maxDate.getDate() + 1
    );
  }

  return cfg;
});

function validateDate(d: Date | null): boolean {
  error.value = "";
  if (!d) return true;
  const val = floorStartOfDay(d);
  const today = floorStartOfDay(new Date());

  if (props.futureOnly && val < today) {
    error.value = "Please select today or a future date";
    return false;
  }
  if (props.minDate) {
    const minLocal = floorStartOfDay(props.minDate);
    if (val < minLocal) {
      error.value = `Please select on or after ${minLocal.toLocaleDateString()}`;
      return false;
    }
  }
  if (props.maxDate) {
    const maxLocal = floorStartOfDay(props.maxDate);
    if (val > maxLocal) {
      error.value = `Please select on or before ${maxLocal.toLocaleDateString()}`;
      return false;
    }
  }
  return true;
}

// external -> internal
watch(
  () => props.modelValue,
  (v) => {
    if (!v) {
      internalDate.value = null;
      lastValidDate.value = null;
      error.value = "";
      return;
    }
    const parsed = parseLocalYYYYMMDD(v);
    if (!parsed) return;
    internalDate.value = parsed;
    lastValidDate.value = parsed;
    error.value = "";
  },
  { immediate: true }
);

// internal -> external
watch(internalDate, (val) => {
  if (validateDate(val)) {
    lastValidDate.value = val;
    emit("update:modelValue", formatLocalYYYYMMDD(val));
  } else {
    nextTick(() => {
      internalDate.value = lastValidDate.value;
    });
  }
});

function clearSelection() {
  internalDate.value = null;
  lastValidDate.value = null;
  error.value = "";
  emit("update:modelValue", null);
}
</script>

<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 font-medium text-gray-700">{{
      label
    }}</label>
    <div class="relative">
      <div
        class="flex items-center w-full gap-2 px-3 py-2 bg-white rounded-lg shadow-sm focus-within:ring-2"
        :class="
          error ? 'focus-within:ring-red-400' : 'focus-within:ring-indigo-400'
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-slate-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <Datepicker
          v-model="internalDate"
          :disabled-dates="disabledDates"
          :use-utc="false"
          :format="(d: Date) => formatLocalYYYYMMDD(d)"
          :hideInput="false"
          :typeable="true"
          :placeholder="placeholder || 'Select a date'"
          :input-class="[
            'w-full bg-transparent border-0 px-0 py-0 focus:outline-none',
          ]"
          :wrapper-class="'flex-1'"
          :clear-button="true"
          :calendar-button="false"
          :monday-first="false"
          :open-date="null"
          :name="label || 'date'"
          :input-attr="{
            'aria-invalid': !!error,
            'aria-describedby': error ? 'date-error' : undefined,
          }"
        />
        <button
          v-if="clearable !== false && internalDate"
          type="button"
          class="inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-500 hover:bg-gray-100 hover:text-slate-700"
          @click="clearSelection"
          aria-label="Clear date"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.415L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <p v-if="error" id="date-error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
::v-deep(.vuejs3-datepicker__value) {
  border: none;
  padding: 0;
  background: transparent;
}
::v-deep(.vuejs3-datepicker__icon) {
  display: none !important;
}
::v-deep(.vuejs3-datepicker__inputvalue) {
  border: none !important;
  padding: 0 !important;
  background: transparent !important;
  min-width: 0;
}
::v-deep(.vuejs3-datepicker__typeablecalendar) {
  display: none;
}
::v-deep(.vuejs3-datepicker__calendar) {
  background-color: #fff;
  border-radius: 40px;
}

::v-deep(.vuejs3-datepicker__clear-button) {
  cursor: pointer;
  font-style: normal;
  position: absolute;
  right: 12px;
  top: 1px;
}
</style>
