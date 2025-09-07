import FormBuilder from "./FormBuilder.vue";
import { within, userEvent, expect } from "storybook/test";
const meta = {
    title: "Forms/FormBuilder",
    component: FormBuilder,
    tags: ["autodocs"],
};
export default meta;
// ---------------------- Default Form (Basic Example) ----------------------
export const BasicForm = {
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
export const ComplexForm = {
    render: () => ({
        components: { FormBuilder },
        template: `<FormBuilder :title="'Complex Form'" :showCustomFields="true" />`,
    }),
};
// ---------------------- Conditional Fields Example ----------------------
export const ConditionalFields = {
    render: () => ({
        components: { FormBuilder },
        template: `<FormBuilder :title="'Conditional Form'" :showCustomFields="true" />`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const yesCheckbox = canvasElement.querySelector('input[type="checkbox"][value="yes"]');
        if (yesCheckbox)
            await userEvent.click(yesCheckbox);
        await expect(canvas.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    },
};
// ---------------------- Validation Error States ----------------------
export const ValidationErrors = {
    render: () => ({
        components: { FormBuilder },
        template: `<FormBuilder :title="'Validation Errors'" :showCustomFields="false" />`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const submit = await canvas.findByRole("button", { name: /submit/i });
        await userEvent.click(submit);
        const errors = canvasElement.querySelectorAll("p.text-red-500");
        await expect(errors.length).toBeGreaterThan(0);
    },
};
// ---------------------- Disabled / Loading State ----------------------
export const LoadingState = {
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
export const Playground = {
    render: () => ({
        components: { FormBuilder },
        template: `<FormBuilder :title="'Playground'" :showCustomFields="false" />`,
    }),
};
