import BaseTextField from "../components/base/BaseTextField.vue";
const meta = {
    title: "Fields/BaseTextField",
    component: BaseTextField,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text", description: "Field label" },
        placeholder: { control: "text", description: "Placeholder text" },
        modelValue: { control: "text", description: "v-model binding value" },
        required: { control: "boolean", description: "Mark field required" },
        disabled: { control: "boolean", description: "Disable input" },
    },
};
export default meta;
export const Default = {
    args: { label: "Full Name", placeholder: "Enter your name", modelValue: "" },
};
export const Disabled = {
    args: {
        label: "Full Name",
        placeholder: "Cannot edit",
        modelValue: "John Doe",
        disabled: true,
    },
};
export const ErrorState = {
    args: {
        label: "Full Name",
        placeholder: "Enter your name",
        modelValue: "",
        required: true,
    },
    play: async ({ canvasElement }) => {
        const input = canvasElement.querySelector("input");
        if (input)
            input.blur();
    },
};
