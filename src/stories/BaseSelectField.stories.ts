import BaseSelectField from "../components/base/BaseSelectField.vue";
import { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof BaseSelectField> = {
  title: "Fields/BaseSelectField",
  component: BaseSelectField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Field label" },
    modelValue: { control: "text", description: "v-model value" },
    options: { control: "object", description: "Dropdown options" },
    multiple: { control: "boolean", description: "Allow multiple selection" },
    allowCustom: { control: "boolean", description: "Allow custom input" },
    placeholder: { control: "text", description: "Placeholder text" },
  },
};

export default meta;
type Story = StoryObj<typeof BaseSelectField>;

export const Default: Story = {
  args: {
    label: "Select Gender",
    modelValue: "",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    placeholder: "Choose gender",
  },
};

export const Multiple: Story = {
  args: {
    label: "Select Options",
    modelValue: [],
    options: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" },
    ],
    multiple: true,
  },
};
