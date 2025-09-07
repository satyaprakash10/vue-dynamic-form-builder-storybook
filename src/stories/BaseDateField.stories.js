import BaseDateField from "../components/base/BaseDateField.vue";
const meta = {
    title: "Fields/BaseDateField",
    component: BaseDateField,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text", description: "Field label" },
        modelValue: { control: "date", description: "Selected date" },
        disabled: { control: "boolean", description: "Disable input" },
    },
};
export default meta;
export const Default = {
    args: { label: "Select Date", modelValue: null },
};
