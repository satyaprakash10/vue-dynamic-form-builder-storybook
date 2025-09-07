import BaseDateField from "../components/base/BaseDateField.vue";
import { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof BaseDateField> = {
  title: "Fields/BaseDateField",
  component: BaseDateField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Field label" },
    placeholder: { control: "text", description: "Placeholder text" },
    modelValue: { control: false, description: "Selected date (YYYY-MM-DD)" },
    minDate: { control: "date", description: "Minimum selectable date" },
    maxDate: { control: "date", description: "Maximum selectable date" },
    futureOnly: { control: "boolean", description: "Only allow today/future" },
    clearable: { control: "boolean", description: "Show clear button" },
  },
  args: {
    label: "Field Title",
  },
};

export default meta;
type Story = StoryObj<typeof BaseDateField>;

export const Default: Story = {
  args: {
    placeholder: "Select a date",
    modelValue: "",
    clearable: true,
  },
};

export const WithMinAndMax: Story = {
  args: {
    placeholder: "Between next 7 days",
    modelValue: "",
    minDate: new Date(),
    maxDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    clearable: true,
  },
};

export const FutureOnly: Story = {
  args: {
    placeholder: "Today or later",
    modelValue: "",
    futureOnly: true,
    clearable: true,
  },
};
