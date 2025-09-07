import BaseDateField from "../components/base/BaseDateField.vue";
const meta = {
  title: "Fields/BaseDateField",
  component: BaseDateField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Field label" },
    modelValue: { control: false, description: "Selected date (YYYY-MM-DD)" },
    placeholder: { control: "text", description: "Placeholder" },
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
export const Default = {
  args: {
    placeholder: "Select a date",
    modelValue: "",
    clearable: true,
  },
};
