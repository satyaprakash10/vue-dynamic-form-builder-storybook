import { ref, toRaw } from "vue";
export function useFormState(target, { autosaveKey = "form-draft", historyLimit = 50 } = {}) {
    const undoStack = ref([]);
    const redoStack = ref([]);
    const isSaving = ref(false);
    const lastSaved = ref(null);
    function snapshot() {
        return JSON.parse(JSON.stringify(toRaw(target)));
    }
    function applySnapshot(snap) {
        Object.keys(snap).forEach((k) => {
            if (Array.isArray(snap[k]) && Array.isArray(target[k])) {
                target[k].splice(0, target[k].length, ...snap[k]);
            }
            else if (typeof snap[k] === "object" && typeof target[k] === "object") {
                Object.keys(target[k]).forEach((kk) => delete target[k][kk]);
                Object.assign(target[k], snap[k]);
            }
            else {
                target[k] = snap[k];
            }
        });
    }
    function recordChange() {
        undoStack.value.push(snapshot());
        if (undoStack.value.length > historyLimit)
            undoStack.value.shift();
        redoStack.value = [];
    }
    function undo() {
        if (!undoStack.value.length)
            return;
        const snap = undoStack.value.pop();
        redoStack.value.push(snapshot());
        applySnapshot(snap);
    }
    function redo() {
        if (!redoStack.value.length)
            return;
        const snap = redoStack.value.pop();
        undoStack.value.push(snapshot());
        applySnapshot(snap);
    }
    async function saveDraft() {
        isSaving.value = true;
        const data = { snapshot: snapshot(), savedAt: Date.now() };
        localStorage.setItem(autosaveKey, JSON.stringify(data));
        lastSaved.value = data.savedAt;
        await new Promise((r) => setTimeout(r, 500)); // simulate delay
        isSaving.value = false;
    }
    function loadDraft() {
        const raw = localStorage.getItem(autosaveKey);
        if (!raw)
            return;
        const parsed = JSON.parse(raw);
        if (parsed.snapshot) {
            applySnapshot(parsed.snapshot);
            lastSaved.value = parsed.savedAt;
            undoStack.value = [snapshot()]; // start history with restored snapshot
            redoStack.value = [];
        }
    }
    return {
        undo,
        redo,
        recordChange,
        saveDraft,
        loadDraft,
        isSaving,
        lastSaved,
        undoStack,
        redoStack,
    };
}
