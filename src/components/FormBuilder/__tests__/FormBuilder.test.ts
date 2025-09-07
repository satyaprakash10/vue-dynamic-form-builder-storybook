import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import FormBuilder from "../FormBuilder.vue";

// Mock toast to avoid timers/warnings
vi.mock("../../../composables/toast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

describe("FormBuilder (smoke)", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("renders and submits with default fields", async () => {
    const wrapper = mount(FormBuilder, {});
    const submit = wrapper.find('button[type="submit"]');
    if (submit.exists()) {
      await submit.trigger("click");
      // Ensures no exceptions during submit flow
      expect(wrapper.html()).toContain("Submit");
    }
  });
});
