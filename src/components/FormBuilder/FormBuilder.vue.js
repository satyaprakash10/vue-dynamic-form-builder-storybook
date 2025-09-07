import { reactive, ref, computed, onMounted, watch, onBeforeUnmount, } from "vue";
import BaseTextField from "../../components/base/BaseTextField.vue";
import BaseSelectField from "../../components/base/BaseSelectField.vue";
import BaseCheckboxGroup from "../../components/base/BaseCheckboxGroup.vue";
import BaseDateField from "../../components/base/BaseDateField.vue";
import DynamicOptionsInput from "../../components/DynamicOptionsInput.vue";
import BaseDropdown from "../../components/base/BaseDropdown.vue";
import { useToast } from "../../composables/toast";
import { useFormValidation } from "../../composables/useFormValidation";
import { useFormState } from "../../composables/useFormState";
const props = defineProps();
const title = computed(() => props.title ?? "Dynamic Form Builder");
const isLoading = computed(() => !!props.loading);
const showCustomFieldsVal = computed(() => props.showCustomFields !== false);
const toast = useToast();
const formData = reactive({});
const fields = reactive([
    {
        id: "name",
        type: "text",
        name: "name",
        label: "Full Name",
        placeholder: "Enter your name",
    },
    {
        id: "gender",
        type: "select",
        name: "gender",
        label: "Gender",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
        ],
    },
    { id: "dob", type: "date", name: "dob", label: "Date of Birth" },
    {
        id: "subscribe",
        type: "checkbox-group",
        name: "subscribe",
        label: "Subscribe",
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
        ],
        minSelected: 1,
        maxSelected: 1,
    },
]);
const customFields = reactive([]);
// Initialize default values
fields.forEach((f) => (formData[f.name] = ["checkbox-group"].includes(f.type) ? [] : ""));
// --- Undo/Redo/Save ---
const AUTOSAVE_KEY = "my-form-draft";
const formState = useFormState({ formData, customFields }, { autosaveKey: AUTOSAVE_KEY });
const canUndo = computed(() => formState.undoStack.value.length > 0);
const canRedo = computed(() => formState.redoStack.value.length > 0);
const isDirty = computed(() => formState.undoStack.value.length > 0);
// Submit loader state
const isSubmitting = ref(false);
// --- Validation ---
let schema = {
    name: [
        { message: "Name is required", validator: (v) => !!v?.trim() },
    ],
    gender: [{ message: "Gender is required", validator: (v) => !!v }],
    dob: [{ message: "DOB required", validator: (v) => !!v }],
    subscribe: [
        {
            message: "You must select at least one option",
            validator: (v) => Array.isArray(v) && v.length > 0,
        },
    ],
};
function coerceDate(d) {
    if (!d)
        return undefined;
    return d instanceof Date ? d : new Date(d);
}
function ensureFieldSchema(name) {
    if (!schema[name])
        schema[name] = [];
}
// Extend schema with per-field constraints
[...fields, ...customFields].forEach((f) => {
    // Date rules
    if (f.type === "date") {
        ensureFieldSchema(f.name);
        const minD = coerceDate(f.minDate);
        const maxD = coerceDate(f.maxDate);
        if (f.futureOnly) {
            schema[f.name].push({
                message: "Date must be in the future",
                validator: (v) => {
                    if (!v)
                        return true;
                    const val = new Date(v);
                    const today = new Date();
                    const floor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return val >= floor;
                },
            });
        }
        if (minD) {
            schema[f.name].push({
                message: `Date must be after ${minD.toLocaleDateString()}`,
                validator: (v) => (!v ? true : new Date(v) >= minD),
            });
        }
        if (maxD) {
            schema[f.name].push({
                message: `Date must be before ${maxD.toLocaleDateString()}`,
                validator: (v) => (!v ? true : new Date(v) <= maxD),
            });
        }
    }
    // Checkbox rules
    if (f.type === "checkbox-group") {
        ensureFieldSchema(f.name);
        if (typeof f.minSelected === "number") {
            schema[f.name].push({
                message: `Select at least ${f.minSelected}`,
                validator: (v) => Array.isArray(v) ? v.length >= f.minSelected : false,
            });
        }
        if (typeof f.maxSelected === "number") {
            schema[f.name].push({
                message: `Select at most ${f.maxSelected}`,
                validator: (v) => Array.isArray(v) ? v.length <= f.maxSelected : false,
            });
        }
    }
});
const { validate, errors } = useFormValidation([...fields, ...customFields], formData, schema);
// --- Custom Fields ---
const newFieldLabel = ref("");
const newFieldName = ref("");
const newFieldType = ref("");
const newFieldOptions = ref([]);
const fieldTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Select", value: "select" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Checkbox", value: "checkbox-group" },
    { label: "Radio", value: "radio" },
    { label: "Date", value: "date" },
];
function addCustomField() {
    if (!newFieldLabel.value || !newFieldName.value || !newFieldType.value)
        return toast.error("Please fill all fields!");
    const id = Date.now().toString();
    const field = {
        id,
        type: newFieldType.value,
        name: newFieldName.value,
        label: newFieldLabel.value,
        placeholder: newFieldLabel.value,
        options: newFieldOptions.value.length
            ? [...newFieldOptions.value]
            : undefined,
        multiple: newFieldType.value === "select",
        allowCustom: newFieldType.value === "select",
    };
    customFields.push(field);
    formData[field.name] = ["checkbox-group"].includes(field.type) ? [] : "";
    formState.recordChange();
    toast.success("Custom field added!");
    newFieldLabel.value = newFieldName.value = newFieldType.value = "";
    newFieldOptions.value = [];
}
// --- Actions ---
function handleUndo() {
    formState.undo();
    toast.info("Undo applied");
}
function handleRedo() {
    formState.redo();
    toast.info("Redo applied");
}
async function handleSave() {
    await formState.saveDraft();
    toast.success("Draft saved!");
}
function discardDraft() {
    localStorage.removeItem(AUTOSAVE_KEY);
    toast.info("Draft discarded.");
}
function formatDateTime(ts) {
    return ts ? new Date(ts).toLocaleString() : "";
}
async function handleSubmit() {
    isSubmitting.value = true;
    try {
        // Generic validation for custom fields (required non-empty)
        let customOk = true;
        customFields.forEach((f) => {
            const v = formData[f.name];
            const bad = Array.isArray(v) ? v.length === 0 : !v && v !== 0;
            if (bad) {
                // @ts-ignore - errors is reactive map from validation composable
                errors[f.name] = "This field is required";
                customOk = false;
            }
        });
        if (await validate()) {
            if (customOk)
                toast.success("Form submitted successfully!");
            else
                toast.error("Fix validation errors");
        }
        else {
            toast.error("Fix validation errors");
        }
        // small delay to surface loading spinner effect
        await new Promise((r) => setTimeout(r, 600));
    }
    finally {
        isSubmitting.value = false;
    }
}
// --- Autosave & Recovery (Undo/Redo friendly) ---
let autosaveTimer = null;
function scheduleAutosave() {
    if (autosaveTimer)
        clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(async () => {
        // capture a snapshot for undo/redo and persist
        formState.recordChange();
        await formState.saveDraft();
    }, 500);
}
onMounted(() => {
    // Recover draft on reload if present
    formState.loadDraft();
});
watch(() => formData, () => scheduleAutosave(), { deep: true });
watch(() => customFields, () => scheduleAutosave(), { deep: true });
onBeforeUnmount(() => {
    if (autosaveTimer)
        clearTimeout(autosaveTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "max-w-4xl p-6 mx-auto space-y-6 bg-gray-100 border border-slate-200 rounded-xl" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "mb-4 text-2xl font-bold text-gray-800" },
});
(__VLS_ctx.title);
// @ts-ignore
[title,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center gap-3 mb-6" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleUndo) },
    type: "button",
    disabled: (!__VLS_ctx.canUndo),
    ...{ class: "px-3 py-1 transition bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40" },
});
// @ts-ignore
[handleUndo, canUndo,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleRedo) },
    type: "button",
    disabled: (!__VLS_ctx.canRedo),
    ...{ class: "px-3 py-1 transition bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40" },
});
// @ts-ignore
[handleRedo, canRedo,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleSave) },
    type: "button",
    ...{ class: "flex items-center gap-2 px-3 py-1 text-white transition bg-indigo-600 rounded hover:bg-indigo-700" },
});
// @ts-ignore
[handleSave,];
if (__VLS_ctx.formState.isSaving.value) {
    // @ts-ignore
    [formState,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "w-4 h-4 animate-spin" },
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z",
    });
}
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.formState.isSaving.value ? "Saving..." : "Save Draft");
// @ts-ignore
[formState,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.discardDraft) },
    type: "button",
    ...{ class: "px-3 py-1 ml-2 text-sm text-red-600 transition rounded bg-red-50 hover:bg-red-100" },
});
// @ts-ignore
[discardDraft,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ml-auto text-sm italic text-gray-500" },
});
if (__VLS_ctx.isDirty) {
    // @ts-ignore
    [isDirty,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
if (__VLS_ctx.formState.lastSaved.value) {
    // @ts-ignore
    [formState,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.formatDateTime(__VLS_ctx.formState.lastSaved.value));
    // @ts-ignore
    [formState, formatDateTime,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: (__VLS_ctx.isLoading ? 'pointer-events-none opacity-60' : '') },
    ...{ class: "transition-opacity" },
});
// @ts-ignore
[isLoading,];
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "space-y-4" },
});
// @ts-ignore
[handleSubmit,];
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.fields))) {
    // @ts-ignore
    [fields,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (field.id),
    });
    if (['text', 'number'].includes(field.type)) {
        /** @type {[typeof BaseTextField, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(BaseTextField, new BaseTextField({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            placeholder: (field.placeholder),
            type: (field.type === 'number' ? 'number' : 'text'),
            id: (field.name),
            name: (field.name),
        }));
        const __VLS_1 = __VLS_0({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            placeholder: (field.placeholder),
            type: (field.type === 'number' ? 'number' : 'text'),
            id: (field.name),
            name: (field.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'select') {
        /** @type {[typeof BaseSelectField, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(BaseSelectField, new BaseSelectField({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            multiple: (field.multiple),
            allowCustom: (field.allowCustom),
            placeholder: (field.placeholder || field.label),
            label: (field.label),
        }));
        const __VLS_5 = __VLS_4({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            multiple: (field.multiple),
            allowCustom: (field.allowCustom),
            placeholder: (field.placeholder || field.label),
            label: (field.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'checkbox-group') {
        /** @type {[typeof BaseCheckboxGroup, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(BaseCheckboxGroup, new BaseCheckboxGroup({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            label: (field.label),
            minSelected: (field.minSelected),
            maxSelected: (field.maxSelected),
            required: (true),
        }));
        const __VLS_9 = __VLS_8({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            label: (field.label),
            minSelected: (field.minSelected),
            maxSelected: (field.maxSelected),
            required: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'date') {
        /** @type {[typeof BaseDateField, ]} */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(BaseDateField, new BaseDateField({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            minDate: (__VLS_ctx.coerceDate(field.minDate)),
            maxDate: (__VLS_ctx.coerceDate(field.maxDate)),
            futureOnly: (field.futureOnly),
        }));
        const __VLS_13 = __VLS_12({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            minDate: (__VLS_ctx.coerceDate(field.minDate)),
            maxDate: (__VLS_ctx.coerceDate(field.maxDate)),
            futureOnly: (field.futureOnly),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        // @ts-ignore
        [formData, coerceDate, coerceDate,];
    }
    if (__VLS_ctx.errors[field.name]) {
        // @ts-ignore
        [errors,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "mt-1 text-sm text-red-500" },
        });
        (__VLS_ctx.errors[field.name]);
        // @ts-ignore
        [errors,];
    }
}
const __VLS_16 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
// @ts-ignore
TransitionGroup;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    name: "fade",
    tag: "div",
    ...{ class: "space-y-4" },
}));
const __VLS_18 = __VLS_17({
    name: "fade",
    tag: "div",
    ...{ class: "space-y-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_20 } = __VLS_19.slots;
if (__VLS_ctx.customFields.length) {
    // @ts-ignore
    [customFields,];
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "pt-4 mt-8 text-lg font-bold text-gray-700 border-t" },
    });
}
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.customFields))) {
    // @ts-ignore
    [customFields,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (field.id),
        ...{ class: "p-4 border rounded-lg bg-gray-50" },
    });
    if (field.label) {
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            ...{ class: "block mb-1 text-base font-medium text-gray-700" },
        });
        (field.label);
    }
    if (['text', 'number'].includes(field.type)) {
        /** @type {[typeof BaseTextField, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(BaseTextField, new BaseTextField({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            placeholder: (field.placeholder),
            type: (field.type === 'number' ? 'number' : 'text'),
            id: (field.name),
            name: (field.name),
        }));
        const __VLS_22 = __VLS_21({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            placeholder: (field.placeholder),
            type: (field.type === 'number' ? 'number' : 'text'),
            id: (field.name),
            name: (field.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'select') {
        /** @type {[typeof BaseSelectField, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(BaseSelectField, new BaseSelectField({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            multiple: (field.multiple),
            allowCustom: (field.allowCustom),
            placeholder: (field.placeholder || field.label),
        }));
        const __VLS_26 = __VLS_25({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            multiple: (field.multiple),
            allowCustom: (field.allowCustom),
            placeholder: (field.placeholder || field.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'dropdown') {
        /** @type {[typeof BaseDropdown, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(BaseDropdown, new BaseDropdown({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options ?? []),
            placeholder: (field.placeholder || field.label),
            label: (field.label || 'Dropdown'),
        }));
        const __VLS_30 = __VLS_29({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options ?? []),
            placeholder: (field.placeholder || field.label),
            label: (field.label || 'Dropdown'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'checkbox-group') {
        /** @type {[typeof BaseCheckboxGroup, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(BaseCheckboxGroup, new BaseCheckboxGroup({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            label: (field.label),
        }));
        const __VLS_34 = __VLS_33({
            modelValue: (__VLS_ctx.formData[field.name]),
            options: (field.options || []),
            label: (field.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        // @ts-ignore
        [formData,];
    }
    else if (field.type === 'radio') {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex gap-2 mt-1" },
        });
        for (const [opt] of __VLS_getVForSourceType((field.options))) {
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
                key: (opt.value),
                ...{ class: "flex items-center gap-1" },
            });
            __VLS_asFunctionalElement(__VLS_elements.input)({
                type: "radio",
                name: (field.name),
                value: (opt.value),
                ...{ class: "form-radio" },
            });
            (__VLS_ctx.formData[field.name]);
            // @ts-ignore
            [formData,];
            (opt.label);
        }
    }
    else if (field.type === 'date') {
        /** @type {[typeof BaseDateField, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(BaseDateField, new BaseDateField({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            minDate: (__VLS_ctx.coerceDate(field.minDate)),
            maxDate: (__VLS_ctx.coerceDate(field.maxDate)),
            futureOnly: (field.futureOnly),
        }));
        const __VLS_38 = __VLS_37({
            modelValue: (__VLS_ctx.formData[field.name]),
            label: (field.label),
            minDate: (__VLS_ctx.coerceDate(field.minDate)),
            maxDate: (__VLS_ctx.coerceDate(field.maxDate)),
            futureOnly: (field.futureOnly),
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        // @ts-ignore
        [formData, coerceDate, coerceDate,];
    }
    if (__VLS_ctx.errors[field.name]) {
        // @ts-ignore
        [errors,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "mt-1 text-sm text-red-500" },
        });
        (__VLS_ctx.errors[field.name]);
        // @ts-ignore
        [errors,];
    }
}
var __VLS_19;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    disabled: (__VLS_ctx.isSubmitting || __VLS_ctx.isLoading),
    ...{ class: "flex items-center gap-2 px-4 py-2 mt-2 text-white transition bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed" },
});
// @ts-ignore
[isLoading, isSubmitting,];
if (__VLS_ctx.isSubmitting || __VLS_ctx.isLoading) {
    // @ts-ignore
    [isLoading, isSubmitting,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "w-5 h-5 animate-spin" },
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z",
    });
}
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.isSubmitting || __VLS_ctx.isLoading ? "Submitting..." : "Submit");
// @ts-ignore
[isLoading, isSubmitting,];
if (__VLS_ctx.isLoading) {
    // @ts-ignore
    [isLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "absolute inset-0 grid place-items-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "flex items-center gap-2 px-3 py-2 text-sm text-white bg-black/50 rounded" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "w-4 h-4 animate-spin" },
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "12",
        cy: "12",
        r: "10",
        'stroke-width': "4",
        ...{ class: "opacity-25" },
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M4 12a8 8 0 018-8",
        'stroke-width': "4",
        ...{ class: "opacity-75" },
    });
}
if (__VLS_ctx.showCustomFieldsVal) {
    // @ts-ignore
    [showCustomFieldsVal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "max-w-4xl p-6 mt-6 space-y-4 transition shadow-lg bg-gray-50 rounded-xl" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "mb-2 text-lg font-semibold text-gray-800" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "grid grid-cols-1 gap-3 sm:grid-cols-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        placeholder: "Field Label",
        ...{ class: "p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" },
    });
    (__VLS_ctx.newFieldLabel);
    // @ts-ignore
    [newFieldLabel,];
    __VLS_asFunctionalElement(__VLS_elements.input)({
        placeholder: "Field Name",
        ...{ class: "p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" },
    });
    (__VLS_ctx.newFieldName);
    // @ts-ignore
    [newFieldName,];
    /** @type {[typeof BaseDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(BaseDropdown, new BaseDropdown({
        modelValue: (__VLS_ctx.newFieldType),
        options: (__VLS_ctx.fieldTypeOptions),
        placeholder: "Select Field Type",
        label: "Field Type",
        ...{ class: "w-full" },
    }));
    const __VLS_42 = __VLS_41({
        modelValue: (__VLS_ctx.newFieldType),
        options: (__VLS_ctx.fieldTypeOptions),
        placeholder: "Select Field Type",
        label: "Field Type",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [newFieldType, fieldTypeOptions,];
    const __VLS_45 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        name: "fade",
    }));
    const __VLS_47 = __VLS_46({
        name: "fade",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const { default: __VLS_49 } = __VLS_48.slots;
    if (['select', 'checkbox-group', 'radio', 'dropdown'].includes(__VLS_ctx.newFieldType)) {
        // @ts-ignore
        [newFieldType,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "p-3 mt-3 space-y-2 bg-white rounded-lg shadow-md" },
        });
        /** @type {[typeof DynamicOptionsInput, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(DynamicOptionsInput, new DynamicOptionsInput({
            modelValue: (__VLS_ctx.newFieldOptions),
        }));
        const __VLS_51 = __VLS_50({
            modelValue: (__VLS_ctx.newFieldOptions),
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        // @ts-ignore
        [newFieldOptions,];
    }
    var __VLS_48;
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.addCustomField) },
        ...{ class: "px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600" },
    });
    // @ts-ignore
    [addCustomField,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "p-4 mt-4 bg-gray-100 border-t-1 border-slate-300" },
});
__VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)({
    ...{ class: "text-sm font-bold text-gray-700" },
});
__VLS_asFunctionalElement(__VLS_elements.pre, __VLS_elements.pre)({
    ...{ class: "p-2 mt-2 text-xs bg-white rounded-lg" },
});
(__VLS_ctx.formData);
// @ts-ignore
[formData,];
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-40']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-indigo-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-opacity']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-radio']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-indigo-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['place-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-indigo-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-1']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        BaseTextField: BaseTextField,
        BaseSelectField: BaseSelectField,
        BaseCheckboxGroup: BaseCheckboxGroup,
        BaseDateField: BaseDateField,
        DynamicOptionsInput: DynamicOptionsInput,
        BaseDropdown: BaseDropdown,
        title: title,
        isLoading: isLoading,
        showCustomFieldsVal: showCustomFieldsVal,
        formData: formData,
        fields: fields,
        customFields: customFields,
        formState: formState,
        canUndo: canUndo,
        canRedo: canRedo,
        isDirty: isDirty,
        isSubmitting: isSubmitting,
        coerceDate: coerceDate,
        errors: errors,
        newFieldLabel: newFieldLabel,
        newFieldName: newFieldName,
        newFieldType: newFieldType,
        newFieldOptions: newFieldOptions,
        fieldTypeOptions: fieldTypeOptions,
        addCustomField: addCustomField,
        handleUndo: handleUndo,
        handleRedo: handleRedo,
        handleSave: handleSave,
        discardDraft: discardDraft,
        formatDateTime: formatDateTime,
        handleSubmit: handleSubmit,
    }),
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
