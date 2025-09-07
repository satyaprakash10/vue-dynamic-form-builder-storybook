import { defineStore } from "pinia";
export const useFormStore = defineStore("form", {
    state: () => ({
        formData: {},
        errors: {},
    }),
    getters: {
        getFieldValue: (state) => {
            return (name) => state.formData[name];
        },
        getFieldErrors: (state) => {
            return (name) => state.errors[name] ?? [];
        },
    },
    actions: {
        setFields(schema) {
            const initial = {};
            schema.forEach((f) => {
                if (f.type === "checkbox-group" ||
                    (f.type === "select" && f.multiple)) {
                    initial[f.id] = [];
                }
                else {
                    initial[f.id] = null;
                }
            });
            this.formData = initial;
            this.errors = {};
        },
        updateField(name, value) {
            this.formData[name] = value;
        },
        setError(name, messages) {
            this.errors[name] = messages;
        },
        clearError(name) {
            delete this.errors[name];
        },
        resetForm() {
            this.formData = {};
            this.errors = {};
        },
    },
});
