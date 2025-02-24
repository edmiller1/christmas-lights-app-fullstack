import { StateCreator } from "zustand";

interface EditStepSlice {
  editStep: number;
  setEditStep: (step: number) => void;
  increaseEditStep: (step: number) => void;
  decreaseEditStep: (step: number) => void;
}

const createEditStepSlice: StateCreator<EditStepSlice> = (set) => ({
  editStep: 1,
  setEditStep: (step) => set(() => ({ editStep: step })),
  increaseEditStep: (step) =>
    set((state) => ({ ...state, editStep: step + 1 })),
  decreaseEditStep: (step) =>
    set((state) => ({ ...state, editStep: step - 1 })),
});

export default createEditStepSlice;
export type { EditStepSlice };
