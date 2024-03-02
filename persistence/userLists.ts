import { createCreateOperation, createGetOperation, createFindOperation, createDeleteOperation } from './lib'
import type { UserList, UserListCreateProps, UserListFindProps } from './types'

export const userListCreate = createCreateOperation<UserListCreateProps>('userLists')

export const userListGet = createGetOperation<UserList>('userLists')

export const userListsFind = createFindOperation<UserList, UserListFindProps>('userLists')

export const userListDelete = createDeleteOperation('userLists')
