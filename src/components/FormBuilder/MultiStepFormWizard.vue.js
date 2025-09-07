import { ref, reactive } from "vue";
const props = defineProps();
const emit = defineEmits();
const currentStep = ref(0);
const isNavigating = ref(false);
const model = reactive({ ...(props.model || {}) });
const stepError = ref("");
async function validate(index) {
    stepError.value = "";
    const ok = (await props.validateStep?.(index, model)) ?? true;
    if (!ok)
        stepError.value = "Please complete the required fields to continue.";
    return ok;
}
async function goNext() {
    isNavigating.value = true;
    try {
        const ok = await validate(currentStep.value);
        if (!ok)
            return;
        if (currentStep.value < props.steps.length - 1) {
            currentStep.value += 1;
            emit("update:model", model);
            emit("change", currentStep.value);
        }
    }
    finally {
        isNavigating.value = false;
    }
}
function goPrev() {
    if (currentStep.value > 0) {
        currentStep.value -= 1;
        emit("change", currentStep.value);
    }
}
async function finish() {
    isNavigating.value = true;
    try {
        const ok = await validate(currentStep.value);
        if (!ok)
            return;
        if (typeof props.onFinish === "function") {
            await props.onFinish(model);
        }
        emit("finish", model);
    }
    finally {
        isNavigating.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "w-full max-w-3xl mx-auto" },
});
__VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)({
    ...{ class: "flex items-center w-full mb-6 text-sm font-medium text-gray-500" },
});
for (const [s, i] of __VLS_getVForSourceType((__VLS_ctx.steps))) {
    // @ts-ignore
    [steps,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
        key: (s.id || i),
        ...{ class: "flex-1 flex items-center gap-2 group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: ([
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200',
                i <= __VLS_ctx.currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300',
            ]) },
    });
    // @ts-ignore
    [currentStep,];
    (i + 1);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "truncate" },
    });
    (s.title);
    if (i < __VLS_ctx.steps.length - 1) {
        // @ts-ignore
        [steps,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "flex-1 h-0.5 bg-gray-200 ml-2" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "p-5 bg-white border rounded-lg shadow transition transform duration-200" },
});
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
    mode: "out-in",
}));
const __VLS_2 = __VLS_1({
    name: "fade",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    key: (__VLS_ctx.currentStep),
});
// @ts-ignore
[currentStep,];
var __VLS_5 = {
    model: (__VLS_ctx.model),
    stepError: (__VLS_ctx.stepError),
};
var __VLS_6 = __VLS_tryAsConstant(`step-${__VLS_ctx.currentStep}`);
// @ts-ignore
[currentStep, model, stepError,];
var __VLS_3;
if (__VLS_ctx.stepError) {
    // @ts-ignore
    [stepError,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "mt-2 text-sm text-red-600" },
    });
    (__VLS_ctx.stepError);
    // @ts-ignore
    [stepError,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center justify-between mt-5" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goPrev) },
    type: "button",
    ...{ class: "px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50" },
    disabled: (__VLS_ctx.currentStep === 0 || __VLS_ctx.isNavigating),
});
// @ts-ignore
[currentStep, goPrev, isNavigating,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "flex items-center gap-2" },
});
if (__VLS_ctx.currentStep < __VLS_ctx.steps.length - 1) {
    // @ts-ignore
    [steps, currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.goNext) },
        type: "button",
        ...{ class: "px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition disabled:opacity-50" },
        disabled: (__VLS_ctx.isNavigating),
    });
    // @ts-ignore
    [isNavigating, goNext,];
    if (__VLS_ctx.isNavigating) {
        // @ts-ignore
        [isNavigating,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-4 h-4 mr-2 animate-spin inline" },
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
}
else {
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.finish) },
        type: "button",
        ...{ class: "px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition disabled:opacity-50" },
        disabled: (__VLS_ctx.isNavigating),
    });
    // @ts-ignore
    [isNavigating, finish,];
    if (__VLS_ctx.isNavigating) {
        // @ts-ignore
        [isNavigating,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-4 h-4 mr-2 animate-spin inline" },
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
}
const __VLS_9 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    name: "fade",
}));
const __VLS_11 = __VLS_10({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_13 } = __VLS_12.slots;
if (__VLS_ctx.currentStep === __VLS_ctx.steps.length - 1) {
    // @ts-ignore
    [steps, currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mt-4 p-4 bg-gray-50 border rounded" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
        ...{ class: "mb-2 text-sm font-semibold text-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_elements.pre, __VLS_elements.pre)({
        ...{ class: "p-3 text-xs bg-white border rounded shadow overflow-auto" },
    });
    (__VLS_ctx.model);
    // @ts-ignore
    [model,];
}
var __VLS_12;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-indigo-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
// @ts-ignore
var __VLS_7 = __VLS_6, __VLS_8 = __VLS_5;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        currentStep: currentStep,
        isNavigating: isNavigating,
        model: model,
        stepError: stepError,
        goNext: goNext,
        goPrev: goPrev,
        finish: finish,
    }),
    __typeEmits: {},
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
