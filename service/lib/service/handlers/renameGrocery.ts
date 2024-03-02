import { listGroceryRename } from '@my-groceries/persistence'

export const renameGrocery = async (groceryId: number, newName: string) => {
  await listGroceryRename(groceryId, newName)
}
