import { listRename } from "@my-groceries/persistence"

export const renameList = async (listId: number, newName: string) => {
  await listRename(listId, newName)
}
