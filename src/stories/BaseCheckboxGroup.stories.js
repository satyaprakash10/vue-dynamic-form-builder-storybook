import BaseCheckboxGroup from "../components/base/BaseCheckboxGroup.vue";
const meta = {
    title: "Fields/BaseCheckboxGroup",
    component: BaseCheckboxGroup,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text", description: "Field label" },
        options: { control: "object", description: "Checkbox options" },
        modelValue: { control: "array", description: "v-model array" },
    },
};
export default meta;
export const Default = {
    args: {
        label: "Subscribe",
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
        ],
        modelValue: [],
    },
};
