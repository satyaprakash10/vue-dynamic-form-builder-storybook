import { useToast } from "../composables/toast";
const { toasts, dismiss } = useToast();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "fixed z-50 flex flex-col gap-2 top-4 right-4" },
});
const __VLS_0 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
// @ts-ignore
TransitionGroup;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "toast",
    tag: "div",
}));
const __VLS_2 = __VLS_1({
    name: "toast",
    tag: "div",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
for (const [toast] of __VLS_getVForSourceType((__VLS_ctx.toasts))) {
    // @ts-ignore
    [toasts,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (toast.id),
        ...{ class: ([
                'flex items-start gap-3 max-w-sm px-4 py-3 rounded shadow-md text-white transform transition-all duration-300',
                toast.type === 'success' && 'bg-green-600',
                toast.type === 'error' && 'bg-red-600',
                toast.type === 'warning' && 'bg-yellow-500 text-black',
                toast.type === 'info' && 'bg-blue-600',
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        'aria-hidden': "true",
        ...{ class: "mt-0.5" },
    });
    if (toast.type === 'success') {
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-5 h-5" },
            viewBox: "0 0 20 20",
            fill: "currentColor",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'fill-rule': "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z",
            'clip-rule': "evenodd",
        });
    }
    else if (toast.type === 'error') {
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-5 h-5" },
            viewBox: "0 0 20 20",
            fill: "currentColor",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'fill-rule': "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293z",
            'clip-rule': "evenodd",
        });
    }
    else if (toast.type === 'warning') {
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-5 h-5" },
            viewBox: "0 0 20 20",
            fill: "currentColor",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'fill-rule': "evenodd",
            d: "M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.335-.213 3.01-1.742 3.01H3.48c-1.53 0-2.492-1.675-1.743-3.01l6.52-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z",
            'clip-rule': "evenodd",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            ...{ class: "w-5 h-5" },
            viewBox: "0 0 20 20",
            fill: "currentColor",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'fill-rule': "evenodd",
            d: "M18 10A8 8 0 112 10a8 8 0 0116 0zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z",
            'clip-rule': "evenodd",
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "flex-1 text-sm" },
    });
    (toast.message);
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.dismiss(toast.id);
                // @ts-ignore
                [dismiss,];
            } },
        type: "button",
        ...{ class: "inline-flex items-center justify-center w-5 h-5 text-white/90 hover:text-white focus:outline-none" },
        'aria-label': "Dismiss",
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "w-4 h-4" },
        viewBox: "0 0 20 20",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'fill-rule': "evenodd",
        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
        'clip-rule': "evenodd",
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        toasts: toasts,
        dismiss: dismiss,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
