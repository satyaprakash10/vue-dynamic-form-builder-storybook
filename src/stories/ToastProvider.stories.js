import ToastProvider from "../components/ToastProvider.vue";
import { useToast } from "../composables/toast";
const meta = {
    title: "Example/ToastProvider",
    component: ToastProvider,
};
export default meta;
export const Showcase = {
    render: () => ({
        components: { ToastProvider },
        setup() {
            const toast = useToast();
            return { toast };
        },
        template: `
      <div class="space-y-4">
        <ToastProvider />
        <div class="flex flex-wrap gap-2">
          <button class="px-3 py-1 text-white bg-green-600 rounded" @click="toast.success('Saved!')">Success</button>
          <button class="px-3 py-1 text-white bg-red-600 rounded" @click="toast.error('Failed!')">Error</button>
          <button class="px-3 py-1 text-white bg-blue-600 rounded" @click="toast.info('Heads up!')">Info</button>
          <button class="px-3 py-1 text-black bg-yellow-400 rounded" @click="toast.warning('Careful!')">Warning</button>
        </div>
      </div>
    `,
    }),
};
