<script setup lang="ts">
import { useToast } from "../composables/toast";

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="fixed z-50 flex flex-col gap-2 top-4 right-4">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-start gap-3 max-w-sm px-4 py-3 rounded shadow-md text-white transform transition-all duration-300',
          toast.type === 'success' && 'bg-green-600',
          toast.type === 'error' && 'bg-red-600',
          toast.type === 'warning' && 'bg-yellow-500 text-black',
          toast.type === 'info' && 'bg-blue-600',
        ]"
      >
        <!-- Icon -->
        <span aria-hidden="true" class="mt-0.5">
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'warning'"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.335-.213 3.01-1.742 3.01H3.48c-1.53 0-2.492-1.675-1.743-3.01l6.52-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd"
            />
          </svg>
        </span>

        <!-- Message -->
        <p class="flex-1 text-sm">{{ toast.message }}</p>

        <!-- Close button -->
        <button
          type="button"
          @click="dismiss(toast.id)"
          class="inline-flex items-center justify-center w-5 h-5 text-white/90 hover:text-white focus:outline-none"
          aria-label="Dismiss"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.25s ease-out;
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
</style>
