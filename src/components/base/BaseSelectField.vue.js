import { ref, computed, watch, onMounted } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
const props = defineProps();
const emit = defineEmits();
const search = ref("");
const internalOptions = ref(props.options || []);
const selected = ref(props.multiple
    ? [...(props.modelValue || [])]
    : props.modelValue || "");
const loading = ref(false);
const dropdownOpen = ref(false);
// Async load
onMounted(async () => {
    if (props.asyncLoad) {
        loading.value = true;
        internalOptions.value = await props.asyncLoad();
        loading.value = false;
    }
});
// Watch external modelValue changes
watch(() => props.modelValue, (v) => {
    selected.value = props.multiple ? [...(v || [])] : v || "";
});
// Selected label (for single select)
const selectedLabel = computed(() => {
    if (props.multiple)
        return "";
    const opt = internalOptions.value.find((o) => o.value === selected.value);
    return opt ? opt.label : "";
});
// Filtered options
const filteredOptions = computed(() => {
    if (!search.value)
        return internalOptions.value;
    return internalOptions.value.filter((o) => o.label.toLowerCase().includes(search.value.toLowerCase()));
});
function selectOption(opt) {
    const val = opt.value || opt;
    if (props.multiple) {
        if (!selected.value.includes(val)) {
            selected.value.push(val);
            emit("update:modelValue", [...selected.value]);
        }
    }
    else {
        selected.value = val;
        emit("update:modelValue", selected.value);
        dropdownOpen.value = false;
    }
    search.value = "";
}
function removeTag(value) {
    if (props.multiple) {
        selected.value = selected.value.filter((v) => v !== value);
        emit("update:modelValue", [...selected.value]);
    }
    else if (selected.value === value) {
        selected.value = "";
        emit("update:modelValue", "");
    }
}
function addCustomTag() {
    const val = search.value.trim();
    if (!val)
        return;
    if (!internalOptions.value.find((o) => o.label === val)) {
        internalOptions.value.push({ label: val, value: val });
    }
    selectOption(val);
}
function handleClickOutside(event) {
    const el = event.target;
    if (!el.closest(".selectfield-container"))
        dropdownOpen.value = false;
}
document.addEventListener("click", handleClickOutside);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative w-full selectfield-container" },
});
if (props.label) {
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: (props.id),
        ...{ class: "block mb-1 font-medium" },
    });
    (props.label);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.dropdownOpen = true;
            // @ts-ignore
            [dropdownOpen,];
        } },
    ...{ class: "flex flex-wrap gap-1" },
});
if (props.multiple) {
    for (const [val] of __VLS_getVForSourceType((__VLS_ctx.selected))) {
        // @ts-ignore
        [selected,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            key: (val),
            ...{ class: "flex items-center gap-1 px-2 py-1 text-indigo-800 bg-indigo-200 rounded-md" },
        });
        (__VLS_ctx.internalOptions.find((o) => o.value === val)?.label || val);
        // @ts-ignore
        [internalOptions,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(props.multiple))
                        return;
                    __VLS_ctx.removeTag(val);
                    // @ts-ignore
                    [removeTag,];
                } },
            type: "button",
            ...{ class: "text-sm font-bold cursor-pointer" },
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ onFocus: (...[$event]) => {
                if (!(props.multiple))
                    return;
                __VLS_ctx.dropdownOpen = true;
                // @ts-ignore
                [dropdownOpen,];
            } },
        ...{ onKeydown: (...[$event]) => {
                if (!(props.multiple))
                    return;
                props.allowCustom ? __VLS_ctx.addCustomTag() : null;
                // @ts-ignore
                [addCustomTag,];
            } },
        type: "text",
        value: (__VLS_ctx.search),
        placeholder: (props.placeholder || 'Select...'),
        ...{ class: "w-full px-4 py-2 transition-all duration-300 ease-in-out transform border border-gray-300 rounded-lg cursor-pointer focus-within:ring-1 focus-within:ring-indigo-400 hover:bg-gray200" },
    });
    // @ts-ignore
    [search,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "text",
        value: (__VLS_ctx.search),
        placeholder: (__VLS_ctx.selectedLabel || props.placeholder || 'Select...'),
        ...{ class: "w-full px-4 py-3 transition-all duration-300 ease-in-out transform border border-gray-300 rounded-lg shadow-lg cursor-pointer focus-within:ring-1 focus-within:ring-indigo-400 hover:bg-gray200" },
        readonly: true,
    });
    // @ts-ignore
    [search, selectedLabel,];
    const __VLS_0 = {}.ChevronDownIcon;
    /** @type {[typeof __VLS_components.ChevronDownIcon, ]} */ ;
    // @ts-ignore
    ChevronDownIcon;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: ({
                'rotate-180 transition-all transform duration-500 ease-in-out': __VLS_ctx.dropdownOpen,
            }) },
        ...{ class: "absolute w-5 h-5 mt-4 text-gray-400 pointer-events-none right-3" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: ({
                'rotate-180 transition-all transform duration-500 ease-in-out': __VLS_ctx.dropdownOpen,
            }) },
        ...{ class: "absolute w-5 h-5 mt-4 text-gray-400 pointer-events-none right-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    // @ts-ignore
    [dropdownOpen,];
}
const __VLS_5 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    name: "fade",
    mode: "out-in",
}));
const __VLS_7 = __VLS_6({
    name: "fade",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
if (__VLS_ctx.dropdownOpen) {
    // @ts-ignore
    [dropdownOpen,];
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
        ...{ class: "absolute z-50 w-full px-2 py-2 mt-1 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60" },
    });
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ class: "p-2 text-center text-gray-500" },
        });
    }
    for (const [group] of __VLS_getVForSourceType(([
        ...new Set(__VLS_ctx.filteredOptions.map((o) => o.group).filter(Boolean)),
    ]))) {
        // @ts-ignore
        [filteredOptions,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ class: "px-2 py-1 font-medium text-gray-400" },
        });
        (group);
        for (const [opt] of __VLS_getVForSourceType((__VLS_ctx.filteredOptions.filter((o) => o.group === group)))) {
            // @ts-ignore
            [filteredOptions,];
            __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.dropdownOpen))
                            return;
                        __VLS_ctx.selectOption(opt);
                        // @ts-ignore
                        [selectOption,];
                    } },
                key: (opt.value),
                ...{ class: "p-2 transition-all duration-300 ease-in-out transform rounded-lg cursor-pointer hover:rounded-lg hover:bg-gray-200" },
            });
            (opt.label);
        }
    }
    for (const [opt] of __VLS_getVForSourceType((__VLS_ctx.filteredOptions.filter((o) => !o.group)))) {
        // @ts-ignore
        [filteredOptions,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.dropdownOpen))
                        return;
                    __VLS_ctx.selectOption(opt);
                    // @ts-ignore
                    [selectOption,];
                } },
            key: (opt.value),
            ...{ class: "p-2 transition-all duration-300 ease-in-out transform border-b border-gray-300 cursor-pointer hover:rounded-lg hover:bg-gray-200" },
        });
        (opt.label);
    }
    if (props.allowCustom &&
        __VLS_ctx.search.trim() &&
        !__VLS_ctx.filteredOptions.some((o) => o.label === __VLS_ctx.search.trim())) {
        // @ts-ignore
        [search, search, filteredOptions,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ onClick: (__VLS_ctx.addCustomTag) },
            ...{ class: "p-2 font-medium text-indigo-600 cursor-pointer hover:bg-indigo-100" },
        });
        // @ts-ignore
        [addCustomTag,];
        (__VLS_ctx.search.trim());
        // @ts-ignore
        [search,];
    }
    if (!__VLS_ctx.loading &&
        __VLS_ctx.filteredOptions.length === 0 &&
        !(props.allowCustom && __VLS_ctx.search.trim())) {
        // @ts-ignore
        [search, loading, filteredOptions,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ class: "p-2 text-center text-gray-500" },
        });
    }
}
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['selectfield-container']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-800']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:ring-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray200']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-60']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-indigo-100']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        ChevronDownIcon: ChevronDownIcon,
        search: search,
        internalOptions: internalOptions,
        selected: selected,
        loading: loading,
        dropdownOpen: dropdownOpen,
        selectedLabel: selectedLabel,
        filteredOptions: filteredOptions,
        selectOption: selectOption,
        removeTag: removeTag,
        addCustomTag: addCustomTag,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
