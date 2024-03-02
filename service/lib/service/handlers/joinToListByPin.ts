import { userListCreate, userListsFind } from '@my-groceries/persistence'
import { pinCodesClient } from '../../pinCodesClient'
import type { PinCodesPayload } from '../../../types'

export const joinToListByPin = async (userId: number, code: string) => {
  const { payload } = await pinCodesClient.lookup<PinCodesPayload>(code)

  const userLists = await userListsFind({ userId })

  for (const userList of userLists) {
    if (userList.listId === payload.listId) {
      return {
        listId: payload.listId
      }
    }
  }

  await userListCreate({
    userId,
    listId: payload.listId,
    isOwner: true
  })

  return {
    listId: payload.listId
  }
}
