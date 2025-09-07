import BaseCheckboxGroup from "../components/base/BaseCheckboxGroup.vue";
import { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof BaseCheckboxGroup> = {
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
type Story = StoryObj<typeof BaseCheckboxGroup>;

export const Default: Story = {
  args: {
    label: "Subscribe",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    modelValue: [],
  },
};
