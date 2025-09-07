import { ref, watch, defineProps, defineEmits } from "vue";
const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    name: String,
    type: { type: String, default: "text" },
    error: String,
});
const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue || "");
// keep internal in sync when parent updates
watch(() => props.modelValue, (val) => {
    internalValue.value = val ?? "";
});
function updateValue(e) {
    let val = e.target.value;
    // handle number & phone subtype validation
    if (props.type === "number") {
        val = val.replace(/\D/g, "");
    }
    internalValue.value = val;
    emit("update:modelValue", val);
}
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
        for: (__VLS_ctx.id),
        ...{ class: "mb-1 text-sm font-medium text-gray-700" },
    });
    // @ts-ignore
    [id,];
    (__VLS_ctx.label);
    // @ts-ignore
    [label,];
}
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ onInput: (__VLS_ctx.updateValue) },
    id: (__VLS_ctx.id || ''),
    name: (__VLS_ctx.name || ''),
    type: (__VLS_ctx.type || 'text'),
    placeholder: (__VLS_ctx.placeholder || ''),
    value: (__VLS_ctx.internalValue),
    ...{ class: "w-full p-3 transition duration-200 ease-in-out border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:bg-gray-50 cursor-text" },
});
// @ts-ignore
[id, updateValue, name, type, placeholder, internalValue,];
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
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        internalValue: internalValue,
        updateValue: updateValue,
    }),
    emits: {},
    props: {
        modelValue: [String, Number],
        label: String,
        placeholder: String,
        id: String,
        name: String,
        type: { type: String, default: "text" },
        error: String,
    },
});
export default (await import('vue')).defineComponent({
    emits: {},
    props: {
        modelValue: [String, Number],
        label: String,
        placeholder: String,
        id: String,
        name: String,
        type: { type: String, default: "text" },
        error: String,
    },
});
; /* PartiallyEnd: #4569/main.vue */
