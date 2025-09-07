import { describe, it, expect } from "vitest";
import { reactive } from "vue";
import { useFormValidation } from "./useFormValidation";

describe("useFormValidation", () => {
  it("validates fields and sets errors map", async () => {
    const fields = [
      { name: "name", type: "text" },
      { name: "subscribe", type: "checkbox-group" },
    ];
    const formData = reactive<Record<string, any>>({ name: "", subscribe: [] });
    const schema = {
      name: [
        { message: "Name is required", validator: (v: string) => !!v?.trim() },
      ],
      subscribe: [
        {
          message: "Pick at least one",
          validator: (v: any[]) => Array.isArray(v) && v.length > 0,
        },
      ],
    };

    const { errors, validate, validateField } = useFormValidation(
      fields as any,
      formData,
      schema
    );

    const ok = await validate();
    expect(ok).toBe(false);
    expect(errors.name).toBe("Name is required");
    expect(errors.subscribe).toBe("Pick at least one");

    formData.name = "John";
    formData.subscribe = ["yes"];

    const ok2 = await validate();
    expect(ok2).toBe(true);
    expect(errors.name).toBe("");
    expect(errors.subscribe).toBe("");

    // single field
    formData.name = "";
    const ok3 = await validateField("name");
    expect(ok3).toBe(false);
    expect(errors.name).toBe("Name is required");
  });
});
