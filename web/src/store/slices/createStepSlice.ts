import { StateCreator } from "zustand";

interface StepSlice {
  step: number;
  setStep: (step: number) => void;
  increaseStep: (step: number) => void;
  decreaseStep: (step: number) => void;
}

const createStepSlice: StateCreator<StepSlice> = (set) => ({
  step: 1,
  setStep: (step) => set(() => ({ step })),
  increaseStep: (step) => set((state) => ({ ...state, step: step + 1 })),
  decreaseStep: (step) => set((state) => ({ ...state, step: step - 1 })),
});

export default createStepSlice;
export type { StepSlice };
