import { reactive } from "vue";
export function useFormValidation(fields, formData, schema) {
    const errors = reactive({});
    const touched = reactive({});
    // Initialize formData for any missing fields
    fields.forEach((field) => {
        if (!field?.name)
            return;
        if (!(field.name in formData)) {
            formData[field.name] = field.type?.includes("checkbox") ? [] : "";
        }
    });
    async function validateField(name) {
        const rules = schema[name];
        if (!rules) {
            errors[name] = "";
            return true;
        }
        const value = formData[name];
        for (const rule of rules) {
            const result = await rule.validator(value);
            if (!result) {
                errors[name] = rule.message;
                return false;
            }
        }
        errors[name] = "";
        return true;
    }
    async function validate() {
        let valid = true;
        Object.keys(schema).forEach((name) => {
            touched[name] = true;
        });
        for (const name of Object.keys(schema)) {
            const ok = await validateField(name);
            if (!ok)
                valid = false;
        }
        return valid;
    }
    return { errors, touched, validate, validateField };
}
