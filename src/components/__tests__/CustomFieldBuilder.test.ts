import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import CustomFieldBuilder from "../CustomFieldBuilder.vue";

// Mock useToast to avoid timers/logs
vi.mock("../../composables/toast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

type EmittedField = {
  id: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  multiple?: boolean;
  allowCustom?: boolean;
  required?: boolean;
};

describe("CustomFieldBuilder", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("emits add-field with correct payload", async () => {
    const wrapper = mount(CustomFieldBuilder);

    // Fill inputs
    const textInputs = wrapper.findAll('input[type="text"]');
    await textInputs[0].setValue("LabelX");
    await textInputs[1].setValue("nameX");

    // Open dropdown and pick 'Select'
    const dropdownToggle = wrapper.find(".dropdown-wrapper > div");
    await dropdownToggle.trigger("click");
    const selectOpt = wrapper
      .findAll(".p-2")
      .find((li) => li.text() === "Select");
    await selectOpt?.trigger("click");

    // Click Add Field button
    const buttons = wrapper.findAll("button");
    const addBtn = buttons.find((b) =>
      b.text().toLowerCase().includes("add field")
    );
    await addBtn?.trigger("click");

    const events = wrapper.emitted("add-field") as unknown as
      | [EmittedField[]]
      | undefined;
    expect(events).toBeTruthy();
    const payload = events?.[0][0] as EmittedField;
    expect(payload.type).toBe("select");
    expect(payload.label).toBe("LabelX");
    expect(payload.name).toBe("nameX");
  });
});
