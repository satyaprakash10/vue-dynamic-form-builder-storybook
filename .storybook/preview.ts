import type { Preview } from "@storybook/vue3";
import "../src/tailwind.css"; // Import Tailwind CSS
import ToastProvider from "../src/components/ToastProvider.vue";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  layout: "centered",
  a11y: { disable: false },
};

export const decorators = [
  (story) => ({
    components: { ToastProvider },
    template:
      '<div class="w-full p-6"><div class="p-4 bg-gray-100 border-slate-300 border rounded-2xl h-auto"><ToastProvider /><story /></div></div>',
  }),
] as any;

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
