import BaseTextField from "../components/base/BaseTextField.vue";
const meta = {
  title: "Fields/BaseTextField",
  component: BaseTextField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Field label" },
    placeholder: { control: "text", description: "Placeholder text" },
    modelValue: { control: "text", description: "v-model binding value" },
    disabled: { control: "boolean", description: "Disable input" },
    error: { control: "text", description: "Error message" },
  },
  args: {
    label: "Field Title",
  },
};
export default meta;
export const Default = {
  args: { placeholder: "Enter your name", modelValue: "" },
};
export const Disabled = {
  args: {
    placeholder: "Cannot edit",
    modelValue: "John Doe",
    disabled: true,
  },
};
export const ErrorState = {
  args: {
    placeholder: "Enter your name",
    modelValue: "",
  },
};
