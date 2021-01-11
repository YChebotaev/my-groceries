import { GET_INITAL_LIST_NAME } from "../constants";
import { createDomain } from "effector";

interface EnterListNameState {
  open: boolean;
  listName: string | null;
  disabled: boolean;
}

const enterListNameDomain = createDomain("enterListName");

export const toggleEnterListNameEvent = enterListNameDomain.createEvent<
  boolean | void
>();

export const changeListNameEvent = enterListNameDomain.createEvent<string>();

export const enterListNameStore = enterListNameDomain.createStore<EnterListNameState>(
  {
    open: false,
    listName: null,
    disabled: false,
  }
);

enterListNameStore.on(
  toggleEnterListNameEvent,
  (state: EnterListNameState, open: boolean | void) => {
    let nextState;
    if (typeof open !== "undefined") {
      nextState = {
        ...state,
        open,
      };
    } else {
      nextState = {
        ...state,
        open: !state.open,
      };
    }
    if (nextState.open) {
      nextState.listName = GET_INITAL_LIST_NAME();
    }
    return nextState;
  }
);

enterListNameStore.on(
  changeListNameEvent,
  (state: EnterListNameState, listName: string) => {
    return {
      ...state,
      disabled: listName.length <= 0,
      listName,
    };
  }
);
