import type { Preview } from "@storybook/vue3";
import "../src/tailwind.css"; // Import Tailwind CSS
import "./preview.css"; // Global Storybook preview styles to lock scroll
import ToastProvider from "../src/components/ToastProvider.vue";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  layout: "fullscreen",
  a11y: { disable: false },
};

export const decorators = [
  (story) => ({
    components: { ToastProvider },
    template:
      '<div class="w-full h-screen overflow-hidden bg-white"><div class="h-full overflow-auto p-3 sm:p-4"><ToastProvider /><div class="w-full max-w-none"><story /></div></div></div>',
  }),
] as any;

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
