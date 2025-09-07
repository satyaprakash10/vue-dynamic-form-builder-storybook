import { ref } from "vue";
import BaseTextField from "./base/BaseTextField.vue";
import BaseDropdown from "./base/BaseDropdown.vue";
import DynamicOptionsInput from "./DynamicOptionsInput.vue";
import { useToast } from "../composables/toast";
const toast = useToast();
const emit = defineEmits(["add-field"]);
const newFieldType = ref("");
const newFieldLabel = ref("");
const newFieldName = ref("");
const newFieldOptions = ref([]);
const fieldTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Number", value: "number" },
    { label: "Select", value: "select" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Checkbox Group", value: "checkbox-group" },
    { label: "Radio", value: "radio" },
    { label: "Date", value: "date" },
];
function addCustomField() {
    if (!newFieldLabel.value || !newFieldName.value || !newFieldType.value) {
        toast.error("Please fill all required fields!");
        return;
    }
    const field = {
        id: Date.now().toString(),
        type: newFieldType.value,
        name: newFieldName.value,
        label: newFieldLabel.value,
        placeholder: newFieldLabel.value,
        options: ["select", "dropdown", "checkbox-group", "radio"].includes(newFieldType.value)
            ? [...newFieldOptions.value]
            : undefined,
        multiple: newFieldType.value === "select",
        allowCustom: newFieldType.value === "select",
        required: true,
    };
    emit("add-field", field);
    toast.success("Custom field added!");
    // reset UI
    newFieldType.value = "";
    newFieldLabel.value = "";
    newFieldName.value = "";
    newFieldOptions.value = [];
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "p-6 mt-6 shadow bg-gray-50 rounded-xl" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "mb-2 text-lg font-semibold" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grid grid-cols-1 gap-3 sm:grid-cols-3" },
});
/** @type {[typeof BaseTextField, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseTextField, new BaseTextField({
    modelValue: (__VLS_ctx.newFieldLabel),
    placeholder: "Field Label",
}));
const __VLS_1 = __VLS_0({
    modelValue: (__VLS_ctx.newFieldLabel),
    placeholder: "Field Label",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
// @ts-ignore
[newFieldLabel,];
/** @type {[typeof BaseTextField, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(BaseTextField, new BaseTextField({
    modelValue: (__VLS_ctx.newFieldName),
    placeholder: "Field Name",
}));
const __VLS_5 = __VLS_4({
    modelValue: (__VLS_ctx.newFieldName),
    placeholder: "Field Name",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
// @ts-ignore
[newFieldName,];
/** @type {[typeof BaseDropdown, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(BaseDropdown, new BaseDropdown({
    modelValue: (__VLS_ctx.newFieldType),
    options: (__VLS_ctx.fieldTypeOptions),
    placeholder: "Select Field Type",
    label: "Field Type",
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.newFieldType),
    options: (__VLS_ctx.fieldTypeOptions),
    placeholder: "Select Field Type",
    label: "Field Type",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
// @ts-ignore
[newFieldType, fieldTypeOptions,];
if (['select', 'dropdown', 'checkbox-group', 'radio'].includes(__VLS_ctx.newFieldType)) {
    // @ts-ignore
    [newFieldType,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "p-3 mt-3 bg-white rounded-lg" },
    });
    /** @type {[typeof DynamicOptionsInput, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(DynamicOptionsInput, new DynamicOptionsInput({
        modelValue: (__VLS_ctx.newFieldOptions),
    }));
    const __VLS_13 = __VLS_12({
        modelValue: (__VLS_ctx.newFieldOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    // @ts-ignore
    [newFieldOptions,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.addCustomField) },
    ...{ class: "px-4 py-2 mt-3 text-white bg-green-500 rounded hover:bg-green-600" },
});
// @ts-ignore
[addCustomField,];
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-600']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        BaseTextField: BaseTextField,
        BaseDropdown: BaseDropdown,
        DynamicOptionsInput: DynamicOptionsInput,
        newFieldType: newFieldType,
        newFieldLabel: newFieldLabel,
        newFieldName: newFieldName,
        newFieldOptions: newFieldOptions,
        fieldTypeOptions: fieldTypeOptions,
        addCustomField: addCustomField,
    }),
    emits: {},
});
export default (await import('vue')).defineComponent({
    emits: {},
});
; /* PartiallyEnd: #4569/main.vue */
