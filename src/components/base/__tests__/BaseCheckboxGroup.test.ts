import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import BaseCheckboxGroup from "../BaseCheckboxGroup.vue";

describe("BaseCheckboxGroup", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("toggles options and emits updated model", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseCheckboxGroup, {
      props: {
        modelValue: [],
        label: "Subscribe",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        "onUpdate:modelValue": onUpdate,
      },
    });

    const inputs = wrapper.findAll('input[type="checkbox"]');
    await inputs[0].setValue(true);
    expect(onUpdate).toHaveBeenCalledWith(["yes"]);
    await inputs[0].setValue(false);
    expect(onUpdate).toHaveBeenLastCalledWith([]);
  });

  it("shows required error when none selected", async () => {
    const wrapper = mount(BaseCheckboxGroup, {
      props: {
        modelValue: [],
        label: "Options",
        options: [
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ],
        required: true,
      },
    });

    expect(wrapper.text()).toContain("At least one option is required");
  });
});
