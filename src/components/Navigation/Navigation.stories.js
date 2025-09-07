import Navigation from "./Navigation.vue";

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  argTypes: {
    links: {
      description: "Menu links to display in navigation",
      control: "object",
    },
    profile: { description: "Profile information", control: "object" },
    profileMenu: {
      description: "Profile dropdown menu items",
      control: "object",
    },
  },
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Default = {
  args: {
    links: [
      { name: "Home", href: "#" },
      { name: "About", href: "#" },
      { name: "Services", href: "#" },
      { name: "Contact", href: "#" },
    ],
    profile: { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=32" },
    profileMenu: [
      { name: "Profile", href: "#" },
      { name: "Settings", href: "#" },
      { name: "Logout", href: "#" },
    ],
  },
};
