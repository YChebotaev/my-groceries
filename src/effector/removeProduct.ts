import { createDomain } from 'effector'

interface RemoveProductState {
  open: boolean
  listPin: string|null
  index: number|null
}

const removeProductDomain = createDomain('drawer')

export const toggleRemoveProductEvent = removeProductDomain.createEvent<boolean|void>()

export const setListPinEvent = removeProductDomain.createEvent<string>()

export const setIndexEvent = removeProductDomain.createEvent<number>()

export const removeProductStore = removeProductDomain.createStore<RemoveProductState>({
  open: false,
  listPin: null,
  index: null
})

removeProductStore.on(toggleRemoveProductEvent, (state: RemoveProductState, open: boolean|void) => {
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
  if (!nextState.open) {
    nextState.listPin = null
    nextState.index = null
  }
  return nextState;
})

removeProductStore.on(setListPinEvent, (state: RemoveProductState, listPin: string) => {
  return {
    ...state,
    listPin
  }
})

removeProductStore.on(setIndexEvent, (state: RemoveProductState, index: number) => {
  return {
    ...state,
    index
  }
})
