import { List, listGet, userListsFind } from "@my-groceries/persistence"

export const getList = async (userId: number, listId: number) => {
  const [userList] = await userListsFind({ listId, userId })

  if (!userList) return

  const list = await listGet(listId)

  if (!list) return

  return {
    id: list.id,
    name: list.name,
    code: list.code,
    /* Support both sqlite and postgres */
    owner: typeof userList.isOwner === 'boolean'
      ? userList.isOwner
      : Boolean(userList.isOwner)
  } as List
}
