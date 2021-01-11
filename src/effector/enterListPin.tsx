import { LIST_PIN_LENGTH } from "../constants";
import { createDomain } from "effector";

interface EnterListPinState {
  open: boolean;
  listPin: string | null;
  disabled: boolean;
}

const enterListPinDomain = createDomain("enterListPin");

export const toggleEnterListPinEvent = enterListPinDomain.createEvent<
  boolean | void
>();

export const changeListPinEvent = enterListPinDomain.createEvent<string>();

export const enterListPinStore = enterListPinDomain.createStore<EnterListPinState>(
  {
    open: false,
    listPin: null,
    disabled: true,
  }
);

enterListPinStore.on(
  toggleEnterListPinEvent,
  (state: EnterListPinState, open: boolean | void) => {
    if (typeof open !== "undefined") {
      return {
        ...state,
        open,
      };
    } else {
      return {
        ...state,
        open: !state.open,
      };
    }
  }
);

enterListPinStore.on(
  changeListPinEvent,
  (state: EnterListPinState, listPin: string) => {
    return {
      ...state,
      disabled: listPin.length < LIST_PIN_LENGTH,
      listPin,
    };
  }
);
