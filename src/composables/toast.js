import { reactive } from "vue";
const state = reactive({ toasts: [] });
let idCounter = 1;
export const useToast = () => {
    const remove = (id) => {
        const idx = state.toasts.findIndex((t) => t.id === id);
        if (idx !== -1)
            state.toasts.splice(idx, 1);
    };
    const show = (message, type = "info") => {
        const id = idCounter++;
        state.toasts.push({ message, type, id });
        setTimeout(() => remove(id), 3000);
        return id;
    };
    return {
        toasts: state.toasts,
        remove,
        dismiss: remove,
        success: (msg) => show(msg, "success"),
        error: (msg) => show(msg, "error"),
        info: (msg) => show(msg, "info"),
        warning: (msg) => show(msg, "warning"),
    };
};
