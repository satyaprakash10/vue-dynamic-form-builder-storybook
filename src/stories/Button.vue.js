import { computed } from 'vue';
import './button.css';
const props = withDefaults(defineProps(), { primary: false });
const emit = defineEmits();
const classes = computed(() => ({
    'storybook-button': true,
    'storybook-button--primary': props.primary,
    'storybook-button--secondary': !props.primary,
    [`storybook-button--${props.size || 'medium'}`]: true,
}));
const style = computed(() => ({
    backgroundColor: props.backgroundColor,
}));
const onClick = () => {
    emit('click', 1);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({ primary: false });
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.onClick) },
    type: "button",
    ...{ class: (__VLS_ctx.classes) },
    ...{ style: (__VLS_ctx.style) },
});
// @ts-ignore
[onClick, classes, style,];
(__VLS_ctx.label);
// @ts-ignore
[label,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        classes: classes,
        style: style,
        onClick: onClick,
    }),
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
