import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import BaseDropdown from "../BaseDropdown.vue";

describe("BaseDropdown", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("opens and selects an option", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseDropdown, {
      props: {
        modelValue: "",
        label: "Type",
        options: [
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ],
        placeholder: "Pick one",
        "onUpdate:modelValue": onUpdate,
      },
    });

    await wrapper.get(".dropdown-wrapper > div").trigger("click");
    const opt = await wrapper.findAll('[role="option"], .p-2').at(0);
    await opt?.trigger("click");

    expect(onUpdate).toHaveBeenCalledWith("a");
  });
});
