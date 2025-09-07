import Navigation from "./Navigation.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Navigation> = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  argTypes: {},
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {},
};
