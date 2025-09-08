<script setup lang="ts">
import FormBuilder from "./components/FormBuilder/FormBuilder.vue";
import VisualFormBuilder from "./components/FormBuilder/VisualFormBuilder.vue";
import MultiStepFormWizard from "./components/FormBuilder/MultiStepFormWizard.vue";
import ToastProvider from "./components/ToastProvider.vue";
import Navigation from "./components/Navigation/Navigation.vue";
import { ref } from "vue";
import { useToast } from "./composables/toast";

const schema = [
  { id: "name", type: "text", label: "Name", placeholder: "Enter your name" },
  {
    id: "skills",
    type: "select",
    label: "Skills (multi, taggable)",
    placeholder: "Search or add skill",
    searchable: true,
    allowCustom: true,
    taggable: true,
    multiple: true,
    options: [
      { value: "vue", label: "Vue.js", group: "Frontend" },
      { value: "react", label: "React", group: "Frontend" },
      { value: "node", label: "Node.js", group: "Backend" },
    ],
  },
  {
    id: "hobbies",
    type: "checkbox-group",
    label: "Hobbies",
    options: [
      { value: "reading", label: "Reading" },
      { value: "travel", label: "Travel" },
      { value: "coding", label: "Coding" },
    ],
  },
];

const toast = useToast();

const showVisual = ref(false);
const showWizard = ref(false);
const showCustomBuilder = ref(false);
const pendingScrollId = ref<string | null>(null);

// Wizard form model
const wizardModel = ref<{ name?: string; email?: string }>({});
const wizardKey = ref(0);

// Touched flags for wizard field-level styling
const nameTouched = ref(false);
const emailTouched = ref(false);

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onAfterEnter() {
  if (pendingScrollId.value) {
    scrollToId(pendingScrollId.value);
    pendingScrollId.value = null;
  }
}

function toggleVisual() {
  const next = !showVisual.value;
  showVisual.value = next;
  if (next) pendingScrollId.value = "visual-form-section";
}
function toggleWizard() {
  const next = !showWizard.value;
  showWizard.value = next;
  if (next) pendingScrollId.value = "wizard-form-section";
}
function toggleCustom() {
  const next = !showCustomBuilder.value;
  showCustomBuilder.value = next;
  if (next) pendingScrollId.value = "custom-form-section";
}

function validateWizardStep(index: number, model: Record<string, any>) {
  if (index === 0) return !!(model.name && String(model.name).trim());
  if (index === 1)
    return !!(model.email && /.+@.+\..+/.test(String(model.email)));
  return true;
}

function handleWizardFinish() {
  // Success toast
  toast.success("Form submitted successfully. Resetting wizard...");
  // Reset model and wizard to step 1
  wizardModel.value = {};
  nameTouched.value = false;
  emailTouched.value = false;
  // Force remount to reset internal step state
  wizardKey.value += 1;
  // Smooth scroll back to wizard top
  pendingScrollId.value = "wizard-form-section";
}
</script>

<template>
  <div class="px-4">
    <Navigation />
    <div
      class="flex items-center justify-center min-h-screen mt-6 bg-white border shadow-2xl rounded-2xl sm:mt-10 border-slate-300"
    >
      <div class="w-full max-w-4xl p-3 space-y-6 sm:p-6">
        <h1 class="text-xl font-bold text-gray-800">Vue FormBuilder Demo</h1>

        <div class="flex flex-wrap gap-2">
          <button
            class="px-3 py-1 text-sm transition rounded cursor-pointer bg-gray-200 hover:bg-gray-300 active:scale-[0.99]"
            @click="toggleVisual"
          >
            Toggle Visual Builder
          </button>
          <button
            class="px-3 py-1 text-sm transition rounded cursor-pointer bg-gray-200 hover:bg-gray-300 active:scale-[0.99]"
            @click="toggleWizard"
          >
            Toggle Wizard
          </button>
          <button
            class="px-3 py-1 text-sm transition rounded cursor-pointer bg-gray-200 hover:bg-gray-300 active:scale-[0.99]"
            @click="toggleCustom"
          >
            Toggle Custom Fields
          </button>
        </div>

        <transition
          name="fade-slide"
          mode="out-in"
          appear
          @after-enter="onAfterEnter"
        >
          <div class="" id="main-form-section">
            <FormBuilder
              :key="showCustomBuilder ? 'with-custom' : 'no-custom'"
              :schema="schema"
              :enableCustomFieldBuilder="showCustomBuilder"
              @submitted="(data: Record<string, any>) => console.log('Form submitted:', data)"
            />
          </div>
        </transition>

        <transition
          name="fade-slide"
          mode="out-in"
          appear
          @after-enter="onAfterEnter"
        >
          <div v-if="showVisual" id="visual-form-section" class="">
            <h2 class="mt-2 mb-3 text-lg font-semibold">Visual Form Builder</h2>
            <VisualFormBuilder
              @update:schema="(s:any)=>console.log('Schema', s)"
            />
          </div>
        </transition>

        <transition
          name="fade-slide"
          mode="out-in"
          appear
          @after-enter="onAfterEnter"
        >
          <div
            v-if="showWizard"
            id="wizard-form-section"
            class="p-4 bg-gray-200 border rounded-lg shadow-lg border-slate-300 scroll-mt-20"
          >
            <h2 class="mt-2 mb-3 text-lg font-semibold">Multi-Step Wizard</h2>
            <MultiStepFormWizard
              :key="wizardKey"
              :steps="[
                { title: 'Step 1' },
                { title: 'Step 2' },
                { title: 'Review' },
              ]"
              :validateStep="validateWizardStep"
              :model="wizardModel"
              :onFinish="handleWizardFinish"
            >
              <template #step-0="{ model, stepError }">
                <div class="space-y-2">
                  <label class="block text-sm">Name</label>
                  <input
                    v-model="model.name"
                    @blur="nameTouched = true"
                    :class="[
                      'w-full p-2 border rounded-lg shadow-xl hover:bg-gray-200',
                      (nameTouched || stepError) &&
                      (!model.name || !String(model.name).trim())
                        ? 'border-red-500 focus:ring-1 focus:ring-red-400'
                        : 'border-slate-300 focus:ring-1 focus:ring-indigo-400',
                    ]"
                  />
                  <p
                    v-if="
                      (nameTouched || stepError) &&
                      (!model.name || !String(model.name).trim())
                    "
                    class="text-sm text-red-600"
                  >
                    Name is required
                  </p>
                </div>
              </template>
              <template #step-1="{ model, stepError }">
                <div class="space-y-2">
                  <label class="block text-sm">Email</label>
                  <input
                    v-model="model.email"
                    @blur="emailTouched = true"
                    :class="[
                      'w-full p-2 border rounded-lg shadow-xl hover:bg-gray-200',
                      (emailTouched || stepError) &&
                      !(model.email && /.+@.+\..+/.test(String(model.email)))
                        ? 'border-red-500 focus:ring-1 focus:ring-red-400'
                        : 'border-slate-300 focus:ring-1 focus:ring-indigo-400',
                    ]"
                  />
                  <p
                    v-if="
                      (emailTouched || stepError) &&
                      !(model.email && /.+@.+\..+/.test(String(model.email)))
                    "
                    class="text-sm text-red-600"
                  >
                    Enter a valid email
                  </p>
                </div>
              </template>
              <template #step-2="{ model }">
                <div class="text-sm">Review your data below, then submit.</div>
              </template>
            </MultiStepFormWizard>
          </div>
        </transition>

        <div id="custom-form-section"></div>

        <ToastProvider />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.45s ease-in-out, transform 0.45s ease-in-out;
  will-change: opacity, transform;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
