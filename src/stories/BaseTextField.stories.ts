import BaseTextField from "../components/base/BaseTextField.vue";
import { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof BaseTextField> = {
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
type Story = StoryObj<typeof BaseTextField>;

export const Default: Story = {
  args: { label: "Full Name", placeholder: "Enter your name", modelValue: "" },
};

export const Disabled: Story = {
  args: {
    label: "Full Name",
    placeholder: "Cannot edit",
    modelValue: "John Doe",
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Full Name",
    placeholder: "Enter your name",
    modelValue: "",
    required: true,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>("input");
    if (input) input.blur();
  },
};
