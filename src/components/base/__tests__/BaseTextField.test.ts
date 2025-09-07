import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import BaseTextField from "../BaseTextField.vue";

describe("BaseTextField", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("renders with label and updates v-model", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseTextField, {
      props: {
        modelValue: "",
        label: "Full Name",
        name: "name",
        id: "name",
        "onUpdate:modelValue": onUpdate,
      },
    });

    expect(wrapper.text()).toContain("Full Name");
    const input = wrapper.get("input");
    await input.setValue("Alice");
    expect(onUpdate).toHaveBeenCalledWith("Alice");
  });

  it("emits numeric value when type is number", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseTextField, {
      props: {
        modelValue: "",
        type: "number",
        "onUpdate:modelValue": onUpdate,
      },
    });
    const input = wrapper.get("input");
    await input.setValue("123");
    expect(onUpdate).toHaveBeenCalledWith("123");
  });
});
