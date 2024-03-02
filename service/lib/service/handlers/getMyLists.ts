import { userListsFind } from "@my-groceries/persistence"
import { getList } from "./getList"
import type { List } from "../../../types"

export const getMyLists = async (userId: number) => {
  const userLists = await userListsFind({ userId })

  return (await Promise.all(
    userLists
      .map(async (userList) => getList(userId, userList.listId))
  )).filter(list => list) as List[]
}
