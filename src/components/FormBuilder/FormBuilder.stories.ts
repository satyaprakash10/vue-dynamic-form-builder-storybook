import type { Meta, StoryObj } from "@storybook/vue3";
import FormBuilder from "./FormBuilder.vue";
import { within, userEvent, expect, waitFor } from "storybook/test";

const meta: Meta<typeof FormBuilder> = {
  title: "Forms/FormBuilder",
  component: FormBuilder,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FormBuilder>;

// ---------------------- Default Form (Basic Example) ----------------------
export const BasicForm: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `<FormBuilder :title="'Basic Form'" :showCustomFields="false" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = await canvas.findByRole("button", { name: /submit/i });
    await userEvent.click(submit);
    await expect(submit).toBeInTheDocument();
  },
};

// ---------------------- Complex Form (Conceptual) ----------------------
export const ComplexForm: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `<FormBuilder :title="'Complex Form'" :showCustomFields="true" />`,
  }),
};

// ---------------------- Conditional Fields Example ----------------------
export const ConditionalFields: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `<FormBuilder :title="'Conditional Form'" :showCustomFields="true" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const yesCheckbox = canvasElement.querySelector(
      'input[type="checkbox"][value="yes"]'
    ) as HTMLInputElement | null;
    if (yesCheckbox) await userEvent.click(yesCheckbox);
    await expect(
      canvas.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();
  },
};

// ---------------------- Validation Error States ----------------------
export const ValidationErrors: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `<FormBuilder :title="'Validation Errors'" :showCustomFields="false" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = await canvas.findByRole("button", { name: /submit/i });
    await userEvent.click(submit);
    await waitFor(() => {
      const errors = canvasElement.querySelectorAll("p.text-red-500");
      expect(errors.length).toBeGreaterThan(0);
    });
  },
};

// ---------------------- Disabled / Loading State ----------------------
export const LoadingState: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `
      <div>
        <FormBuilder :title="'Loading State'" :loading="true" :showCustomFields="false" />
      </div>
    `,
  }),
};

// ---------------------- Interactive Playground ----------------------
export const Playground: Story = {
  render: () => ({
    components: { FormBuilder },
    template: `<FormBuilder :title="'Playground'" :showCustomFields="false" />`,
  }),
};
