import FormBuilder from "./components/FormBuilder/FormBuilder.vue";
import ToastProvider from "./components/ToastProvider.vue";
import Navigation from "./components/Navigation/Navigation.vue";
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "px-4" },
});
/** @type {[typeof Navigation, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Navigation, new Navigation({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center justify-center min-h-screen mt-6 bg-white border shadow-2xl rounded-2xl sm:mt-10 border-slate-300" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "w-full max-w-4xl p-6" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "mb-4 text-xl font-bold text-gray-800" },
});
/** @type {[typeof FormBuilder, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(FormBuilder, new FormBuilder({
    ...{ 'onSubmitted': {} },
    schema: (__VLS_ctx.schema),
}));
const __VLS_5 = __VLS_4({
    ...{ 'onSubmitted': {} },
    schema: (__VLS_ctx.schema),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
const __VLS_9 = ({ submitted: {} },
    { onSubmitted: ((data) => console.log('Form submitted:', data)) });
// @ts-ignore
[schema,];
var __VLS_6;
/** @type {[typeof ToastProvider, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(ToastProvider, new ToastProvider({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:mt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-800']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        FormBuilder: FormBuilder,
        ToastProvider: ToastProvider,
        Navigation: Navigation,
        schema: schema,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
