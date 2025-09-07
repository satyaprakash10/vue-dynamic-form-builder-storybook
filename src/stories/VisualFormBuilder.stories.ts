import { Meta, StoryObj } from "@storybook/vue3";
import VisualFormBuilder from "../components/FormBuilder/VisualFormBuilder.vue";
import { within, userEvent, expect } from "storybook/test";

const meta: Meta<typeof VisualFormBuilder> = {
  title: "Example/VisualFormBuilder",
  component: VisualFormBuilder,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof VisualFormBuilder>;

export const Basic: Story = {
  render: () => ({
    components: { VisualFormBuilder },
    setup() {
      function handleSchema(schema: any) {
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
