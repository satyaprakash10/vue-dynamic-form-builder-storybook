import { Meta, StoryObj } from "@storybook/vue3";
import MultiStepFormWizard from "../components/FormBuilder/MultiStepFormWizard.vue";
import { within, userEvent, expect } from "storybook/test";
import { reactive, ref } from "vue";

const meta: Meta<typeof MultiStepFormWizard> = {
  title: "Example/MultiStepFormWizard",
  component: MultiStepFormWizard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    steps: { control: "object", description: "Array of steps with title" },
  },
};

export default meta;

type Story = StoryObj<typeof MultiStepFormWizard>;

export const Basic: Story = {
  args: {
    steps: [{ title: "Account" }, { title: "Profile" }, { title: "Confirm" }],
  },
  render: (args) => ({
    components: { MultiStepFormWizard },
    setup() {
      const model = reactive({ email: "", name: "" });
      const invalid = reactive<{ email: boolean; name: boolean }>({
        email: false,
        name: false,
      });
      const validateStep = (index: number, m: any) => {
        if (index === 0) {
          invalid.email = !/.+@.+\..+/.test(m.email);
          return !invalid.email;
        }
        if (index === 1) {
          invalid.name = !(m.name && m.name.trim());
          return !invalid.name;
        }
        return true;
      };
      const onFinish = () => console.log("Finished with:", model);
      return { args, model, validateStep, onFinish, invalid };
    },
    template: `
      <MultiStepFormWizard v-bind="args" class="p-4" v-model:model="model" :validateStep="validateStep" :onFinish="onFinish">
        <template #step-0="{ model, stepError }">
          <div class="space-y-2">
            <label class="block text-sm">Email</label>
            <input v-model="model.email" class="w-full p-2 border rounded focus:ring transition" :class="invalid.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'" placeholder="email@example.com" />
            <p v-if="invalid.email" class="text-xs text-red-600">Please enter a valid email address</p>
          </div>
        </template>
        <template #step-1="{ model }">
          <div class="space-y-2">
            <label class="block text-sm">Full name</label>
            <input v-model="model.name" class="w-full p-2 border rounded focus:ring transition" :class="invalid.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'" placeholder="John Doe" />
            <p v-if="invalid.name" class="text-xs text-red-600">Name is required</p>
          </div>
        </template>
        <template #step-2="{ model }">
          <p class="text-sm text-gray-700">Review your details before submitting</p>
          <ul class="mt-2 text-sm">
            <li><strong>Email:</strong> {{ model.email }}</li>
            <li><strong>Name:</strong> {{ model.name }}</li>
          </ul>
        </template>
      </MultiStepFormWizard>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = await canvas.findByRole("button", { name: /Next/i });
    await userEvent.click(next);
    const email = await canvas.findByPlaceholderText(/email@example.com/i);
    await userEvent.type(email, "foo@bar.com");
    await userEvent.click(next);
    const name = await canvas.findByPlaceholderText(/John Doe/i);
    await userEvent.type(name, "John Tester");
    await userEvent.click(next);
    const submit = await canvas.findByRole("button", { name: /Submit/i });
    await expect(submit).toBeInTheDocument();
  },
};
