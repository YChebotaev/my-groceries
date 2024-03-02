import { userListsFind, listCreate, userListCreate, listSetCode, listGet, listGroceryCreate } from "@my-groceries/persistence"
import { pinCodesClient } from '../../pinCodesClient'
import { PinCodesPayload } from "../../../types"
import { initialGroceries } from '../../initialGroceries'
import { getList } from "./getList"

export const createList = async (userId: number) => {
  const userLists = await userListsFind({ userId })

  const listId = await listCreate({ name: `Мой список ${userLists.length + 1}` })

  const { code } = await pinCodesClient.create<PinCodesPayload>({ listId })

  await listSetCode(listId, code)

  await userListCreate({ userId, listId, isOwner: true })

  for (const name of initialGroceries) {
    await listGroceryCreate({ listId, name })
  }

  return getList(userId, listId)
}
