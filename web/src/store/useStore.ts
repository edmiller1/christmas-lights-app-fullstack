import { create } from "zustand";

import {
  createDecorationImagesSlice,
  createDecorationInfoSlice,
  createDialogOpenSlice,
  createSubmitDecorationSlice,
} from "./slices";
import { DecorationImageSlice } from "./slices/createDecorationImagesSlice";
import { DecorationInfoSlice } from "./slices/createDecorationInfoSlice";
import { DialogOpenSlice } from "./slices/createDialogOpenSlice";
import createStepSlice, { StepSlice } from "./slices/createStepSlice";
import { SubmitDecorationSlice } from "./slices/createSubmitDecorationSlice";

const useStore = create<
  DecorationImageSlice &
    DecorationInfoSlice &
    SubmitDecorationSlice &
    StepSlice &
    DialogOpenSlice
>()((...set) => ({
  ...createDecorationImagesSlice(...set),
  ...createDecorationInfoSlice(...set),
  ...createSubmitDecorationSlice(...set),
  ...createStepSlice(...set),
  ...createDialogOpenSlice(...set),
}));

export default useStore;
