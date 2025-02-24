import { StateCreator } from "zustand";

interface EditDialogOpenSlice {
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
}

const createEditDialogOpenSlice: StateCreator<EditDialogOpenSlice> = (set) => ({
  editDialogOpen: false,
  setEditDialogOpen: (open) =>
    set((state) => ({
      ...state,
      editDialogOpen: open,
    })),
});

export default createEditDialogOpenSlice;
export type { EditDialogOpenSlice };
