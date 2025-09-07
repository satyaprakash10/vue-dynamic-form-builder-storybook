import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import MultiStepFormWizard from "../MultiStepFormWizard.vue";

describe("MultiStepFormWizard", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("navigates steps with validation", async () => {
    const validateStep = vi.fn((i: number, m: any) => true);
    const wrapper = mount(MultiStepFormWizard, {
      props: {
        steps: [{ title: "One" }, { title: "Two" }],
        validateStep,
      },
      slots: {
        "step-0": "<div>Step 1</div>",
        "step-1": "<div>Step 2</div>",
      },
    });

    const btns = wrapper.findAll("button");
    const next = btns.find((b) => b.text().toLowerCase().includes("next"));
    await next?.trigger("click");
    expect(validateStep).toHaveBeenCalledWith(0, expect.any(Object));
  });
});
