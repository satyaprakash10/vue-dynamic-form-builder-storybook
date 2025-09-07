import DynamicOptionsInput from "../components/DynamicOptionsInput.vue";
import { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof DynamicOptionsInput> = {
  title: "Fields/DynamicOptionsInput",
  component: DynamicOptionsInput,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "object", description: "Array of options" },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicOptionsInput>;

export const Default: Story = {
  args: {
    modelValue: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  },
};
