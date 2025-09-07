import BaseTextField from "../components/base/BaseTextField.vue";
import { Meta, StoryObj } from "@storybook/vue3";
import { ref, computed } from "vue";

const meta: Meta<typeof BaseTextField> = {
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
type Story = StoryObj<typeof BaseTextField>;

export const Default: Story = {
  args: { placeholder: "Enter your name", modelValue: "" },
};

export const Disabled: Story = {
  args: {
    placeholder: "Cannot edit",
    modelValue: "John Doe",
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "At least 3 characters",
    modelValue: "",
  },
  render: (args) => ({
    components: { BaseTextField },
    setup() {
      const value = ref<string>(args.modelValue as string);
      const error = computed(() =>
        value.value && value.value.length > 0 && value.value.length < 3
          ? "Please enter at least 3 characters"
          : ""
      );
      return { args, value, error };
    },
    template: `<BaseTextField  :title="ErrorState" v-bind="args" v-model="value" :error="error" />`,
  }),
};
