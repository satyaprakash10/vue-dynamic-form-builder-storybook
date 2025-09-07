import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import BaseSelectField from "../BaseSelectField.vue";

describe("BaseSelectField", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("selects a single option", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseSelectField, {
      props: {
        modelValue: "",
        options: [
          { label: "One", value: "1" },
          { label: "Two", value: "2" },
        ],
        placeholder: "Select...",
        "onUpdate:modelValue": onUpdate,
      },
    });

    await wrapper.find("input[readonly]").trigger("click");
    const option = wrapper.findAll("li").find((li) => li.text() === "One");
    await option?.trigger("click");
    expect(onUpdate).toHaveBeenCalledWith("1");
  });

  it("adds and selects custom tag in multiple mode", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseSelectField, {
      props: {
        modelValue: [],
        multiple: true,
        allowCustom: true,
        options: [],
        "onUpdate:modelValue": onUpdate,
      },
    });

    const input = wrapper.get('input[type="text"]');
    await input.setValue("TagX");
    await input.trigger("keydown.enter");

    // Should emit updated array including TagX
    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(Array.isArray(lastCall)).toBe(true);
    expect(lastCall).toContain("TagX");
  });
});
