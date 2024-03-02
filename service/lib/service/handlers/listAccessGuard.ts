import { userListsFind } from '@my-groceries/persistence'

export const listAccessGuard = async (userId: number, listId: number) => {
  const userLists = await userListsFind({ userId, listId })

  return userLists.length > 0
}
