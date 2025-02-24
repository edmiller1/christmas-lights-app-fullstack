import { StateCreator } from "zustand";
import { EditableImage } from "@/lib/types";

interface EditDecorationImageSlice {
  editedImages: EditableImage[];
  setEditedImages: (images: EditableImage[]) => void;
  deletedImages: string[];
  setDeletedImages: (images: string[]) => void;
}

const createEditDecorationImagesSlice: StateCreator<
  EditDecorationImageSlice
> = (set) => ({
  editedImages: [],
  setEditedImages: (images) => set({ editedImages: images }),
  deletedImages: [],
  setDeletedImages: (images) => set({ deletedImages: images }),
});

export default createEditDecorationImagesSlice;
export type { EditDecorationImageSlice };
