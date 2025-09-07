import BaseDropdown from "../components/base/BaseDropdown.vue";
const meta = {
    title: "Fields/BaseDropdown",
    component: BaseDropdown,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text", description: "Field label" },
        options: { control: "object", description: "Dropdown options" },
        modelValue: { control: "text", description: "v-model value" },
        placeholder: { control: "text", description: "Placeholder text" },
    },
};
export default meta;
export const Default = {
    args: {
        label: "Select Option",
        modelValue: "",
        options: [
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
        ],
        placeholder: "Choose option",
    },
};
