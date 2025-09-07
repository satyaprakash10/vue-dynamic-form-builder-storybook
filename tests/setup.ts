import { vi, afterAll, beforeAll } from "vitest";

let errorSpy: ReturnType<typeof vi.spyOn> | null = null;
let warnSpy: ReturnType<typeof vi.spyOn> | null = null;
let logSpy: ReturnType<typeof vi.spyOn> | null = null;

beforeAll(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  errorSpy?.mockRestore?.();
  warnSpy?.mockRestore?.();
  logSpy?.mockRestore?.();
});

// Mock datepicker to avoid CSS imports and heavy DOM
vi.mock("vuejs3-datepicker", () => ({
  default: {
    name: "MockDatepicker",
    template: "<input />",
    props: ["modelValue"],
  },
}));
