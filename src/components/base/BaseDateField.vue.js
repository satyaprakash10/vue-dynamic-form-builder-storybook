import { ref, watch, computed, nextTick } from "vue";
import Datepicker from "vue3-datepicker";
const props = defineProps();
const emit = defineEmits(["update:modelValue"]);
// Helpers to handle dates in LOCAL time (avoid UTC off-by-one)
function floorStartOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function parseLocalYYYYMMDD(v) {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m)
        return undefined;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const da = Number(m[3]);
    return new Date(y, mo, da);
}
function formatLocalYYYYMMDD(d) {
    if (!d)
        return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
}
const selectedDate = ref(undefined);
const lastValid = ref(undefined);
const error = ref("");
const min = computed(() => {
    if (props.futureOnly)
        return floorStartOfDay(new Date());
    return props.minDate ? floorStartOfDay(props.minDate) : undefined;
});
const max = computed(() => props.maxDate ? floorStartOfDay(props.maxDate) : undefined);
function validateDate(val) {
    error.value = "";
    if (!val)
        return true;
    const floorVal = floorStartOfDay(val);
    if (props.futureOnly && min.value && floorVal < min.value) {
        error.value = "Date must be in the future";
        return false;
    }
    if (min.value && floorVal < min.value) {
        error.value = `Date must be after ${min.value.toLocaleDateString()}`;
        return false;
    }
    if (max.value && floorVal > max.value) {
        error.value = `Date must be before ${max.value.toLocaleDateString()}`;
        return false;
    }
    return true;
}
// Sync external modelValue -> internal selectedDate (no default selection)
watch(() => props.modelValue, (v) => {
    if (!v) {
        selectedDate.value = undefined;
        lastValid.value = undefined;
        error.value = "";
        return;
    }
    const parsed = parseLocalYYYYMMDD(v);
    if (!parsed)
        return;
    selectedDate.value = parsed;
    lastValid.value = parsed;
    error.value = "";
}, { immediate: true });
// Emit local YYYY-MM-DD and validate; revert invalid
watch(selectedDate, (val) => {
    if (validateDate(val)) {
        lastValid.value = val;
        emit("update:modelValue", formatLocalYYYYMMDD(val));
    }
    else {
        nextTick(() => {
            selectedDate.value = lastValid.value;
        });
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex flex-col" },
});
if (__VLS_ctx.label) {
    // @ts-ignore
    [label,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "mb-1 font-medium text-gray-700" },
    });
    (__VLS_ctx.label);
    // @ts-ignore
    [label,];
}
const __VLS_0 = {}.Datepicker;
/** @type {[typeof __VLS_components.Datepicker, ]} */ ;
// @ts-ignore
Datepicker;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.selectedDate),
    minDate: (__VLS_ctx.min),
    maxDate: (__VLS_ctx.max),
    placeholder: (__VLS_ctx.placeholder || 'Select a date'),
    inputClass: ([
        'w-full p-3 bg-white border border-slate-300 rounded-lg shadow-md cursor-pointer focus:outline-none',
        __VLS_ctx.error
            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
            : 'focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50',
    ]),
    ...{ class: "w-full" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.selectedDate),
    minDate: (__VLS_ctx.min),
    maxDate: (__VLS_ctx.max),
    placeholder: (__VLS_ctx.placeholder || 'Select a date'),
    inputClass: ([
        'w-full p-3 bg-white border border-slate-300 rounded-lg shadow-md cursor-pointer focus:outline-none',
        __VLS_ctx.error
            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
            : 'focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50',
    ]),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[selectedDate, min, max, placeholder, error,];
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "mt-1 text-sm text-red-500" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        Datepicker: Datepicker,
        selectedDate: selectedDate,
        error: error,
        min: min,
        max: max,
    }),
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
