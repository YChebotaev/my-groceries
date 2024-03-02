import { listShortageDelete, listShortagesFind } from '@my-groceries/persistence'

export const groceryFromShortage = async (listId: number, listGroceryId: number) => {
  const shortages = await listShortagesFind({ listId, listGroceryId })

  for (const shortage of shortages) {
    await listShortageDelete(shortage.id)
  }
}
