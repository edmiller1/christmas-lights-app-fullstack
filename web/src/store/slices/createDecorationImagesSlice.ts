import { DecorationImage } from "@/lib/types";
import { StateCreator } from "zustand";

interface DecorationImageSlice {
  decorationImages: DecorationImage[];
  setDecorationImages: (data: DecorationImage[]) => void;
}

const initialState: DecorationImage[] = [];

const createDecorationImagesSlice: StateCreator<DecorationImageSlice> = (
  set
) => ({
  decorationImages: initialState,
  setDecorationImages: (data) =>
    set(() => ({
      decorationImages: data,
    })),
});

export default createDecorationImagesSlice;
export type { DecorationImage, DecorationImageSlice };
