<template>
  <div class="grid grid-cols-12 gap-4">
    <!-- Palette -->
    <div
      class="col-span-12 p-3 bg-white border shadow-sm rounded-xl md:col-span-4 border-slate-300"
    >
      <h3 class="mb-2 text-sm font-semibold text-gray-700">Field Palette</h3>
      <ul class="space-y-2">
        <li
          v-for="type in palette"
          :key="type"
          class="px-3 py-2 text-sm text-gray-700 transition bg-gray-100 border rounded cursor-move border-slate-300 hover:bg-gray-200"
          draggable="true"
          @dragstart="onDragStart(type)"
          @touchend.prevent="onPaletteTouchAdd(type)"
        >
          {{ type }}
        </li>
      </ul>
    </div>

    <!-- Canvas -->
    <div
      class="col-span-12 p-3 bg-white border shadow-sm rounded-xl md:col-span-8 border-slate-300"
    >
      <h3 class="mb-2 text-sm font-semibold text-gray-700">Form Canvas</h3>
      <div
        class="p-3 space-y-3 border-2 border-dashed rounded border-slate-300 min-h-40"
        @dragover.prevent
        @drop="onDrop"
        ref="canvasRef"
      >
        <transition-group name="dnd" tag="div">
          <div
            v-for="(field, idx) in fields"
            :key="field.id"
            class="items-center justify-between p-2 mt-3 transition-all duration-150 border rounded shadow-sm border-slate-300 bg-gray-50 hover:shadow"
            draggable="true"
            @dragstart="onReorderStart(idx)"
            @dragover.prevent
            @drop="onReorderDrop(idx)"
            :data-index="idx"
            data-vfb-item
            @touchstart="onFieldTouchStart(idx, $event)"
            @touchmove.prevent="onFieldTouchMove($event)"
            @touchend="onFieldTouchEnd"
          >
            <div class="text-sm">
              <strong class="mr-2 capitalize">{{ field.type }}</strong>
              <br clear="mt-3 mb-3" />
              <span class="text-gray-600">{{
                field.label || "(no label)"
              }}</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <input
                v-model="field.label"
                placeholder="Label"
                class="px-2 py-1 text-sm border border-indigo-500 rounded-lg shadow-xl hover:bg-gray-200"
              />
              <input
                v-model="field.name"
                placeholder="Name"
                class="px-2 py-1 text-sm border border-indigo-500 rounded-lg shadow-xl hover:bg-gray-200"
              />
              <button
                class="px-2 py-1 text-xs text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
                @click="remove(idx)"
              >
                <svg
                  data-slot="icon"
                  fill="none"
                  stroke-width="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  class="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="flex items-center justify-between mt-3">
        <button
          class="px-3 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
          @click="emitSchema"
        >
          Export Schema
        </button>
        <button
          class="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          @click="clearAll"
        >
          Clear
        </button>
      </div>

      <!-- Live schema preview -->
      <div class="p-3 mt-4 border rounded shadow border-slate-300 bg-gray-50">
        <h4 class="mb-2 text-xs font-semibold text-gray-600">Live Schema</h4>
        <pre
          class="p-3 overflow-auto text-xs bg-white border rounded border-slate-300"
          >{{ fields }}</pre
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

interface FieldDef {
  id: string;
  type: string;
  name: string;
  label: string;
}

const emit = defineEmits<{ (e: "update:schema", value: FieldDef[]): void }>();

const palette = [
  "text",
  "number",
  "select",
  "checkbox-group",
  "radio",
  "date",
  "dropdown",
  "email",
];
const fields = reactive<FieldDef[]>([]);

const dragType = ref<string | null>(null);
const reorderFrom = ref<number | null>(null);
const canvasRef = ref<HTMLElement | null>(null);
const touchReorderFrom = ref<number | null>(null);

function onDragStart(type: string) {
  dragType.value = type;
}

function onDrop() {
  if (!dragType.value) return;
  fields.push({
    id: Date.now().toString(),
    type: dragType.value,
    name: dragType.value + "_" + (fields.length + 1),
    label: dragType.value,
  });
  dragType.value = null;
  emitSchema();
}

function onReorderStart(index: number) {
  reorderFrom.value = index;
}

function onReorderDrop(targetIndex: number) {
  const from = reorderFrom.value;
  if (from === null || from === targetIndex) return;
  const [moved] = fields.splice(from, 1);
  fields.splice(targetIndex, 0, moved);
  reorderFrom.value = null;
  emitSchema();
}

function remove(index: number) {
  fields.splice(index, 1);
  emitSchema();
}

function emitSchema() {
  emit("update:schema", fields);
}

function clearAll() {
  fields.splice(0, fields.length);
  emitSchema();
}

// ---- Mobile touch support ----
function onFieldTouchStart(index: number, _e: TouchEvent) {
  touchReorderFrom.value = index;
}

function getIndexFromTouchEvent(e: TouchEvent): number | null {
  const t = e.changedTouches[0] || e.touches[0];
  if (!t) return null;
  const el = document.elementFromPoint(
    t.clientX,
    t.clientY
  ) as HTMLElement | null;
  const itemEl = el?.closest?.("[data-vfb-item]") as HTMLElement | null;
  if (itemEl && itemEl.dataset && typeof itemEl.dataset.index === "string") {
    const parsed = Number(itemEl.dataset.index);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function onFieldTouchMove(_e: TouchEvent) {
  // No-op for now; visual drag ghost not implemented for simplicity
}

function onFieldTouchEnd(e: TouchEvent) {
  const targetIndex = getIndexFromTouchEvent(e);
  if (targetIndex !== null && touchReorderFrom.value !== null) {
    reorderFrom.value = touchReorderFrom.value;
    onReorderDrop(targetIndex);
  }
  touchReorderFrom.value = null;
}

function onPaletteTouchAdd(type: string) {
  fields.push({
    id: Date.now().toString(),
    type,
    name: type + "_" + (fields.length + 1),
    label: type,
  });
  emitSchema();
}
</script>

<style scoped>
.dnd-enter-active,
.dnd-leave-active {
  transition: all 0.15s ease;
}
.dnd-enter-from,
.dnd-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
