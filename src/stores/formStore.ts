import { defineStore } from "pinia";

export const useFormStore = defineStore("form", {
  state: () => ({
    formData: {} as Record<string, any>,
    errors: {} as Record<string, string[]>,
  }),
  getters: {
    getFieldValue: (state) => {
      return (name: string) => state.formData[name];
    },
    getFieldErrors: (state) => {
      return (name: string) => state.errors[name] ?? [];
    },
  },
  actions: {
    setFields(schema: { id: string; type?: string; multiple?: boolean }[]) {
      const initial: Record<string, any> = {};
      schema.forEach((f) => {
        if (
          f.type === "checkbox-group" ||
          (f.type === "select" && f.multiple)
        ) {
          initial[f.id] = [];
        } else {
          initial[f.id] = null;
        }
      });
      this.formData = initial;
      this.errors = {};
    },
    updateField(name: string, value: any) {
      this.formData[name] = value;
    },
    setError(name: string, messages: string[]) {
      this.errors[name] = messages;
    },
    clearError(name: string) {
      delete this.errors[name];
    },
    resetForm() {
      this.formData = {};
      this.errors = {};
    },
  },
});
