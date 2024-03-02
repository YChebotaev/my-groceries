export type User = {
  id: number
  passwordHash: string
  passwordSalt: string
}

export type UserCreateProps = Omit<User, 'id'>

export type UserFindProps = {}


export type UserSession = {
  id: number
  userId: number
  token: string
  revoked: boolean
}

export type UserSessionCreateProps = Omit<UserSession, 'id'>

export type UserSessionFindProps = Pick<UserSession, 'token'>


export type List = {
  id: number
  name: string
  code: string
}

export type ListCreateProps = Omit<List, 'id' | 'code'>

export type ListFindProps = Pick<List, 'code'>


export type UserList = {
  id: number
  userId: number
  listId: number
  isOwner: boolean
}

export type UserListCreateProps = Pick<UserList, 'userId' | 'listId' | 'isOwner'>

export type UserListFindProps = Partial<Pick<UserList, 'userId' | 'listId'>>


export type ListGrocery = {
  id: number
  listId: number
  name: string
}

export type ListGroceryCreateProps = Pick<ListGrocery, 'listId' | 'name'>

export type ListGroceryFindProps = Partial<Pick<ListGrocery, 'listId'>>


export type ListShortage = {
  id: number
  listId: number
  listGroceryId: number
}

export type ListShortageCreateProps = Pick<ListShortage, 'listId' | 'listGroceryId'>

export type ListShortageFindProps = Partial<Pick<ListShortage, 'listId' | 'listGroceryId'>>
