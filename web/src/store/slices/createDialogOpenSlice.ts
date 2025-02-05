import { StateCreator } from "zustand";

interface DialogOpenSlice {
  dialogOpen: boolean;
  setDialogOpen: (data: boolean) => void;
}

const createDialogOpenSlice: StateCreator<DialogOpenSlice> = (set) => ({
  dialogOpen: false,
  setDialogOpen: (open) =>
    set((state) => ({
      ...state,
      dialogOpen: open,
    })),
});

export default createDialogOpenSlice;
export type { DialogOpenSlice };
