export type CreateSessionResult = {
  token: string
}

export type JoinListResult = {
  listId: number
}

export type List = {
  id: number
  name: string
  owner: boolean
  code: string
}

export type Grocery = {
  id: number
  name: string
  shortage: boolean
}

export type Shortage = {
  id: number
  name: string
  groceryId: number
}

export type PinCodesPayload = {
  listId: number
}
