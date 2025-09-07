import { ref, watch, computed } from "vue";
const props = defineProps();
const emit = defineEmits();
const selected = ref(props.modelValue || []);
watch(() => props.modelValue, (val) => {
    selected.value = val || [];
});
function toggleOption(val) {
    if (selected.value.includes(val)) {
        selected.value = selected.value.filter((v) => v !== val);
    }
    else {
        selected.value.push(val);
    }
    emit("update:modelValue", selected.value);
}
const error = computed(() => {
    const count = selected.value.length;
    if (props.minSelected && count < props.minSelected) {
        return `Select at least ${props.minSelected}`;
    }
    if (props.maxSelected && count > props.maxSelected) {
        return `Select at most ${props.maxSelected}`;
    }
    if (props.required && count === 0) {
        return "At least one option is required";
    }
    return "";
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "space-y-2" },
});
if (__VLS_ctx.label) {
    // @ts-ignore
    [label,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "block text-base font-medium text-gray-700" },
    });
    (__VLS_ctx.label);
    // @ts-ignore
    [label,];
    if (__VLS_ctx.required) {
        // @ts-ignore
        [required,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "text-red-500" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex flex-col gap-2 sm:flex-row sm:flex-wrap" },
});
for (const [opt] of __VLS_getVForSourceType((__VLS_ctx.options))) {
    // @ts-ignore
    [options,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        key: (opt.value),
        ...{ class: "flex items-center gap-2 cursor-pointer" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ onChange: (...[$event]) => {
                __VLS_ctx.toggleOption(opt.value);
                // @ts-ignore
                [toggleOption,];
            } },
        type: "checkbox",
        value: (opt.value),
        checked: (__VLS_ctx.selected.includes(opt.value)),
        ...{ class: "w-4 h-4 text-indigo-600 border-gray-300 rounded hover:ring-2 hover:ring-indigo-300 focus:ring-indigo-500" },
        ...{ class: (__VLS_ctx.error ? 'border-red-500' : '') },
    });
    // @ts-ignore
    [selected, error,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "text-gray-700" },
    });
    (opt.label);
}
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-sm text-red-500" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:ring-indigo-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-indigo-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        selected: selected,
        toggleOption: toggleOption,
        error: error,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
