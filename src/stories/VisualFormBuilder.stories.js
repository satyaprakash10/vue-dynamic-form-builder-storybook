import VisualFormBuilder from "../components/FormBuilder/VisualFormBuilder.vue";
import { within, expect } from "storybook/test";
const meta = {
    title: "Example/VisualFormBuilder",
    component: VisualFormBuilder,
    tags: ["autodocs"],
};
export default meta;
export const Basic = {
    render: () => ({
        components: { VisualFormBuilder },
        setup() {
            function handleSchema(schema) {
                console.log("Exported Schema", schema);
            }
            return { handleSchema };
        },
        template: `
      <div class="space-y-3">
        <VisualFormBuilder @update:schema="handleSchema" />
        <p class="text-xs text-gray-500">Drag items from the palette into the canvas. Drag items inside the canvas to reorder. Click Export Schema to log the current schema.</p>
      </div>
    `,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Can't simulate native drag drop in all environments; ensure palette is visible
        const textItem = await canvas.findByText(/text/i);
        await expect(textItem).toBeInTheDocument();
    },
};
