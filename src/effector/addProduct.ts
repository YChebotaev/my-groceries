import { createDomain } from 'effector'

interface AddProductState {
  open: boolean
  productName: string
  disabled: boolean
  listPin: string|null
}

const addProductDomain = createDomain('drawer')

export const toggleAddProductEvent = addProductDomain.createEvent<boolean|void>()

export const changeProductNameEvent = addProductDomain.createEvent<string>()

export const setListPinEvent = addProductDomain.createEvent<string>()

export const addProductStore = addProductDomain.createStore<AddProductState>({
  open: false,
  productName: '',
  disabled: true,
  listPin: null
})

addProductStore.on(toggleAddProductEvent, (state: AddProductState, open: boolean|void) => {
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
    nextState.productName = '';
    nextState.disabled = true;
  } else {
    nextState.listPin = null
  }
  return nextState;
})

addProductStore.on(changeProductNameEvent, (state: AddProductState, productName: string) => {
  return {
    ...state,
    disabled: productName.length <= 0,
    productName
  }
})

addProductStore.on(setListPinEvent, (state: AddProductState, listPin: string) => {
  return {
    ...state,
    listPin
  }
})
