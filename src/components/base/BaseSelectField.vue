<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/vue/24/solid";

interface Option {
  label: string;
  value: string;
  group?: string;
}

interface Props {
  modelValue: string[] | string;
  options: Option[];
  label?: string;
  multiple?: boolean;
  asyncLoad?: () => Promise<Option[]>;
  placeholder?: string;
  allowCustom?: boolean;
  required?: boolean;
  id?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string[] | string): void;
}>();

const search = ref("");
const internalOptions = ref<Option[]>(props.options || []);
const selected = ref<any>(
  props.multiple
    ? [...((props.modelValue as string[]) || [])]
    : props.modelValue || ""
);
const loading = ref(false);
const dropdownOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);

// Async load
onMounted(async () => {
  if (props.asyncLoad) {
    loading.value = true;
    internalOptions.value = await props.asyncLoad();
    loading.value = false;
  }
});

// Watch external modelValue changes
watch(
  () => props.modelValue,
  (v) => {
    selected.value = props.multiple ? [...((v as string[]) || [])] : v || "";
  }
);

// Selected label (for single select)
const selectedLabel = computed(() => {
  if (props.multiple) return "";
  const opt = internalOptions.value.find((o) => o.value === selected.value);
  return opt ? opt.label : "";
});

// Filtered options
const filteredOptions = computed(() => {
  if (!search.value) return internalOptions.value;
  return internalOptions.value.filter((o) =>
    o.label.toLowerCase().includes(search.value.toLowerCase())
  );
});

function selectOption(opt: Option | string) {
  const val = (opt as Option).value || opt;
  if (props.multiple) {
    if (!selected.value.includes(val)) {
      selected.value.push(val);
      emit("update:modelValue", [...selected.value]);
    }
  } else {
    selected.value = val;
    emit("update:modelValue", selected.value);
    dropdownOpen.value = false;
  }
  search.value = "";
}

function removeTag(value: string) {
  if (props.multiple) {
    selected.value = selected.value.filter((v: string) => v !== value);
    emit("update:modelValue", [...selected.value]);
  } else if (selected.value === value) {
    selected.value = "";
    emit("update:modelValue", "");
  }
}

function clearSingle() {
  if (!props.multiple) {
    selected.value = "";
    emit("update:modelValue", "");
    dropdownOpen.value = false;
  }
}

function addCustomTag() {
  const val = search.value.trim();
  if (!val) return;

  if (!internalOptions.value.find((o) => o.label === val)) {
    internalOptions.value.push({ label: val, value: val });
  }
  selectOption(val);
}

function handleClickOutside(event: MouseEvent) {
  const el = event.target as HTMLElement;
  if (!rootEl.value) return;
  if (!rootEl.value.contains(el)) dropdownOpen.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <div ref="rootEl" class="relative w-full selectfield-container">
    <!-- Label -->
    <label v-if="props.label" :for="props.id" class="block mb-1 font-medium">
      {{ props.label }}
    </label>

    <!-- Input box -->
    <div
      class="relative flex flex-wrap items-center gap-1"
      @click="dropdownOpen = !dropdownOpen"
    >
      <!-- Multiple selected tags -->
      <template v-if="props.multiple">
        <div
          class="relative w-full pr-8 min-h-[42px] px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-indigo-400 flex flex-wrap items-center gap-1 cursor-text"
          @click.stop="dropdownOpen = !dropdownOpen"
        >
          <span
            v-for="val in selected"
            :key="val"
            class="inline-flex items-center max-w-full gap-1 px-2 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-md"
          >
            <span class="truncate">{{
              internalOptions.find((o) => o.value === val)?.label || val
            }}</span>
            <button
              type="button"
              @click.stop="removeTag(val)"
              class="text-sm font-bold cursor-pointer"
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </span>
          <input
            type="text"
            v-model="search"
            :placeholder="
              selected.length === 0 ? props.placeholder || 'Select...' : ''
            "
            class="flex-1 min-w-[80px] px-2 py-1 bg-transparent border-0 outline-none"
            @focus="dropdownOpen = true"
            @keydown.enter.prevent="props.allowCustom ? addCustomTag() : null"
          />
          <ChevronDownIcon
            :class="{
              'rotate-180 transition-all transform duration-500 ease-in-out':
                dropdownOpen,
            }"
            class="absolute w-5 h-5 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2"
          />
        </div>
      </template>

      <!-- Single select -->
      <template v-else>
        <input
          type="text"
          v-model="search"
          :placeholder="selectedLabel || props.placeholder || 'Select...'"
          class="w-full px-4 py-2 transition-all duration-300 ease-in-out transform bg-white border border-gray-300 rounded-lg shadow-lg cursor-pointer focus-within:ring-1 focus-within:ring-indigo-400 hover:bg-gray200"
          readonly
        />
        <div class="absolute inset-y-0 flex items-center gap-1 right-2">
          <button
            v-if="selected"
            type="button"
            @click.stop="clearSingle"
            class="grid w-6 h-6 text-gray-400 transition rounded hover:text-gray-600 hover:bg-gray-100 place-items-center"
            title="Clear"
            aria-label="Clear"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
          <ChevronDownIcon
            :class="{
              'rotate-180 transition-all transform duration-500 ease-in-out':
                dropdownOpen,
            }"
            class="w-5 h-5 text-gray-400 hover:text-gray-600"
          />
        </div>
      </template>
    </div>

    <!-- Dropdown menu -->
    <transition name="menu" mode="out-in">
      <ul
        v-if="dropdownOpen"
        class="absolute z-50 w-full px-2 py-2 mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl max-h-60"
      >
        <li v-if="loading" class="p-2 text-center text-gray-500">Loading...</li>

        <!-- Grouped -->
        <template
          v-for="group in [
            ...new Set(filteredOptions.map((o) => o.group).filter(Boolean)),
          ]"
        >
          <li class="px-2 py-1 font-medium text-gray-400">{{ group }}</li>
          <li
            v-for="opt in filteredOptions.filter((o) => o.group === group)"
            :key="opt.value"
            class="p-2 transition-all duration-150 ease-in-out transform rounded-lg cursor-pointer hover:bg-gray-100"
            @click="selectOption(opt)"
          >
            {{ opt.label }}
          </li>
        </template>

        <!-- Ungrouped -->
        <li
          v-for="opt in filteredOptions.filter((o) => !o.group)"
          :key="opt.value"
          class="p-2 transition-all duration-150 ease-in-out transform border-b border-gray-100 cursor-pointer hover:bg-gray-100"
          @click="selectOption(opt)"
        >
          {{ opt.label }}
        </li>

        <!-- Custom tag -->
        <li
          v-if="
            props.allowCustom &&
            search.trim() &&
            !filteredOptions.some((o) => o.label === search.trim())
          "
          class="p-2 font-medium text-indigo-600 cursor-pointer hover:bg-indigo-100"
          @click="addCustomTag"
        >
          Add "{{ search.trim() }}"
        </li>

        <!-- Empty -->
        <li
          v-if="
            !loading &&
            filteredOptions.length === 0 &&
            !(props.allowCustom && search.trim())
          "
          class="p-2 text-center text-gray-500"
        >
          No options found
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
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
