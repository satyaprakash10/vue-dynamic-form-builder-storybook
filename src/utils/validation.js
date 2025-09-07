export function runValidation(value, formData, rules) {
    const errors = [];
    if (!rules || rules.length === 0)
        return errors;
    rules.forEach((rule) => {
        switch (rule.type) {
            case "required":
                if (value === undefined ||
                    value === null ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0)) {
                    errors.push(rule.message);
                }
                break;
            case "minLength":
                if (typeof value === "string" && value.length < rule.value)
                    errors.push(rule.message);
                break;
            case "maxLength":
                if (typeof value === "string" && value.length > rule.value)
                    errors.push(rule.message);
                break;
            case "pattern":
                if (rule.value instanceof RegExp) {
                    if (!rule.value.test(String(value ?? "")))
                        errors.push(rule.message);
                }
                else {
                    const re = new RegExp(rule.value);
                    if (!re.test(String(value ?? "")))
                        errors.push(rule.message);
                }
                break;
            case "custom":
                if (rule.validator && !rule.validator(value, formData))
                    errors.push(rule.message);
                break;
        }
    });
    return errors;
}
