import { create } from "zustand";

import {
  createDecorationImagesSlice,
  createDecorationInfoSlice,
  createDialogOpenSlice,
  createSubmitDecorationSlice,
  createEditDecorationImageSlice,
  createEditDialogOpenSlice,
  createEditStepSlice,
} from "./slices";
import { DecorationImageSlice } from "./slices/createDecorationImagesSlice";
import { DecorationInfoSlice } from "./slices/createDecorationInfoSlice";
import { DialogOpenSlice } from "./slices/createDialogOpenSlice";
import createStepSlice, { StepSlice } from "./slices/createStepSlice";
import { SubmitDecorationSlice } from "./slices/createSubmitDecorationSlice";
import { EditDecorationImageSlice } from "./slices/editDecorationImagesSlice";
import { EditDialogOpenSlice } from "./slices/editDialogOpenSlice";
import { EditStepSlice } from "./slices/editStepSlice";

const useStore = create<
  DecorationImageSlice &
    DecorationInfoSlice &
    SubmitDecorationSlice &
    StepSlice &
    DialogOpenSlice &
    EditDecorationImageSlice &
    EditDialogOpenSlice &
    EditStepSlice
>()((...set) => ({
  ...createDecorationImagesSlice(...set),
  ...createDecorationInfoSlice(...set),
  ...createSubmitDecorationSlice(...set),
  ...createStepSlice(...set),
  ...createDialogOpenSlice(...set),
  ...createEditDecorationImageSlice(...set),
  ...createEditDialogOpenSlice(...set),
  ...createEditStepSlice(...set),
}));

export default useStore;
