import { createDomain } from 'effector'

interface DrawerState {
  open: boolean
}

const drawerDomain = createDomain('drawer')

export const toggleDrawerEvent = drawerDomain.createEvent<boolean|void>()

export const drawerStore = drawerDomain.createStore<DrawerState>({
  open: false
})

drawerStore.on(toggleDrawerEvent, (state: DrawerState, open: boolean|void) => {
  if (typeof open !== 'undefined') {
    return {
      open
    }
  } else {
    return {
      open: !state.open
    }
  }
})
