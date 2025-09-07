import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import SBButton from "../Button.vue";
import Header from "../Header.vue";

describe("Storybook examples", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("Button emits click", async () => {
    const wrapper = mount(SBButton, { props: { label: "Click me" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("Header toggles auth buttons based on user prop", () => {
    const wrapper = mount(Header, { props: { user: { name: "Jane" } } });
    expect(wrapper.text()).toContain("Welcome");
    expect(wrapper.text()).toContain("Log out");
  });
});
