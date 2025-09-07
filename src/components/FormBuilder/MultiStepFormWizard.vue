<template>
  <div class="w-full">
    <ol class="flex items-center w-full mb-6 text-sm font-medium text-gray-500">
      <li
        v-for="(s, i) in steps"
        :key="(s.id || i) + '-step'"
        class="flex items-center flex-1 gap-2 group"
      >
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200',
            i <= currentStep
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300',
          ]"
        >
          {{ i + 1 }}
        </div>
        <span class="truncate">{{ s.title }}</span>
        <div
          v-if="i < steps.length - 1"
          class="relative flex-1 h-0.5 ml-2 overflow-hidden bg-gray-200 rounded"
        >
          <div
            class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out bg-indigo-600"
            :style="{ width: i < currentStep ? '100%' : '0%' }"
          />
        </div>
      </li>
    </ol>

    <div
      class="p-5 transition duration-200 transform bg-white border rounded-lg shadow border-slate-300"
    >
      <transition name="fade" mode="out-in">
        <div :key="currentStep">
          <slot
            :name="`step-${currentStep}`"
            :model="model"
            :step-error="stepError"
          />
        </div>
      </transition>
      <p v-if="stepError" class="mt-2 text-sm text-red-600">{{ stepError }}</p>
    </div>

    <div class="flex items-center justify-between mt-5">
      <button
        type="button"
        class="px-4 py-2 text-gray-900 transition bg-gray-300 rounded cursor-pointer hover:bg-gray-400 disabled:opacity-50"
        :disabled="currentStep === 0 || isNavigating"
        @click="goPrev"
      >
        Back
      </button>
      <div class="flex items-center gap-2">
        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          class="px-4 py-2 text-white transition bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700 disabled:opacity-50"
          :disabled="isNavigating"
          @click="goNext"
        >
          <svg
            v-if="isNavigating"
            class="inline w-4 h-4 mr-2 animate-spin"
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
          Next
        </button>
        <button
          v-else
          type="button"
          class="px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          :disabled="isNavigating"
          @click="finish"
        >
          <svg
            v-if="isNavigating"
            class="inline w-4 h-4 mr-2 animate-spin"
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
          Submit
        </button>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="currentStep === steps.length - 1"
        class="p-4 mt-4 border rounded bg-gray-50"
      >
        <h4 class="mb-2 text-sm font-semibold text-gray-700">Review</h4>
        <pre class="p-3 overflow-auto text-xs bg-white border rounded shadow">{{
          model
        }}</pre>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

interface StepDef {
  id?: string;
  title: string;
}

const props = defineProps<{
  steps: StepDef[];
  validateStep?: (
    index: number,
    model: Record<string, any>
  ) => Promise<boolean> | boolean;
  onFinish?: (model: Record<string, any>) => Promise<void> | void;
  model?: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "change", index: number): void;
  (e: "finish", model: Record<string, any>): void;
  (e: "update:model", model: Record<string, any>): void;
}>();

const currentStep = ref(0);
const isNavigating = ref(false);
const model = reactive<Record<string, any>>({ ...(props.model || {}) });
const stepError = ref("");

const progressPercent = computed(() => {
  const total = props.steps.length || 1;
  const ratio = (currentStep.value + 1) / total;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
});

async function validate(index: number) {
  stepError.value = "";
  const ok = (await props.validateStep?.(index, model)) ?? true;
  return ok;
}

async function goNext() {
  isNavigating.value = true;
  try {
    const ok = await validate(currentStep.value);
    if (!ok) return;
    if (currentStep.value < props.steps.length - 1) {
      currentStep.value += 1;
      emit("update:model", model);
      emit("change", currentStep.value);
    }
  } finally {
    isNavigating.value = false;
  }
}

function goPrev() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
    emit("change", currentStep.value);
  }
}

async function finish() {
  isNavigating.value = true;
  try {
    const ok = await validate(currentStep.value);
    if (!ok) return;
    if (typeof props.onFinish === "function") {
      await props.onFinish(model);
    }
    emit("finish", model);
  } finally {
    isNavigating.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
