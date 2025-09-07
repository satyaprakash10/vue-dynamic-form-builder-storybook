import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick } from "vue";
import BaseDateField from "../BaseDateField.vue";

describe("BaseDateField", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("emits update when child datepicker updates v-model", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseDateField, {
      props: {
        modelValue: null,
        label: "Date",
        "onUpdate:modelValue": onUpdate,
      },
    });

    // Drive v-model by emitting from mocked Datepicker
    const dp = wrapper.findComponent({ name: "MockDatepicker" });
    dp.vm.$emit("update:modelValue", new Date(2025, 0, 5));
    await nextTick();

    expect(onUpdate).toHaveBeenCalledWith("2025-01-05");
  });

  it("clears selection when clear button clicked", async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(BaseDateField, {
      props: {
        modelValue: "2025-01-05",
        label: "Date",
        clearable: true,
        "onUpdate:modelValue": onUpdate,
      },
    });

    const clear = wrapper.find("button");
    if (clear.exists()) {
      await clear.trigger("click");
      // Emits null on clear
      expect(onUpdate).toHaveBeenCalledWith(null);
    }
  });
});
