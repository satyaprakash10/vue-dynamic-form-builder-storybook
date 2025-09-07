import DynamicOptionsInput from "../components/DynamicOptionsInput.vue";
const meta = {
    title: "Fields/DynamicOptionsInput",
    component: DynamicOptionsInput,
    tags: ["autodocs"],
    argTypes: {
        modelValue: { control: "object", description: "Array of options" },
    },
};
export default meta;
export const Default = {
    args: {
        modelValue: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
        ],
    },
};
