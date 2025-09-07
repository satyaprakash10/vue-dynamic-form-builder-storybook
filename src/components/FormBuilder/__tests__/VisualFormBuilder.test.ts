import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import VisualFormBuilder from "../VisualFormBuilder.vue";

describe("VisualFormBuilder", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("adds fields via onDrop and emits schema", async () => {
    const wrapper = mount(VisualFormBuilder);

    const { onDragStart, onDrop } = wrapper.vm as any;
    onDragStart("text");
    onDrop();

    onDragStart("select");
    onDrop();

    const events = wrapper.emitted("update:schema");
    expect(events).toBeTruthy();
    const last = events?.[events.length - 1][0] as any[];
    expect(last.length).toBe(2);
    expect(last[0].type).toBe("text");
    expect(last[1].type).toBe("select");
  });

  it("reorders and removes fields", async () => {
    const wrapper = mount(VisualFormBuilder);
    const api = wrapper.vm as any;
    api.onDragStart("text");
    api.onDrop();
    api.onDragStart("number");
    api.onDrop();

    // Move index 0 to index 1
    api.onReorderStart(0);
    api.onReorderDrop(1);

    // Remove the first
    api.remove(0);

    const events = wrapper.emitted("update:schema");
    expect(events && events.length).toBeGreaterThan(0);
    const last = events?.[events.length - 1][0] as any[];
    expect(last.length).toBe(1);
  });
});
