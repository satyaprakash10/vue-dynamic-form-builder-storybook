import BaseDropdown from "../components/base/BaseDropdown.vue";
import { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";

const meta: Meta<typeof BaseDropdown> = {
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
type Story = StoryObj<typeof BaseDropdown>;

export const Default: Story = {
  args: {
    label: "Select Option",
    modelValue: "",
    options: [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
    ],
    placeholder: "Choose option",
  },
  render: (args) => ({
    components: { BaseDropdown },
    setup() {
      const value = ref<string>(args.modelValue as string);
      return { args, value };
    },
    template: `<BaseDropdown v-bind="args" v-model="value" />`,
  }),
};
