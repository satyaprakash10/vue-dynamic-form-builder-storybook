import { reactive } from "vue";

interface ToastItem {
  message: string;
  type: "success" | "error" | "info" | "warning";
  id: number;
}

const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] });

let idCounter = 1;

export const useToast = () => {
  const remove = (id: number) => {
    const idx = state.toasts.findIndex((t) => t.id === id);
    if (idx !== -1) state.toasts.splice(idx, 1);
  };

  const show = (message: string, type: ToastItem["type"] = "info") => {
    const id = idCounter++;
    state.toasts.push({ message, type, id });
    setTimeout(() => remove(id), 3000);
    return id;
  };

  return {
    toasts: state.toasts,
    remove,
    dismiss: remove,
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error"),
    info: (msg: string) => show(msg, "info"),
    warning: (msg: string) => show(msg, "warning"),
  };
};
