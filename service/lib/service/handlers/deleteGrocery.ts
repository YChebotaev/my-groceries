import { listGroceryDelete, listShortageDelete, listShortagesFind } from '@my-groceries/persistence'

export const deleteGrocery = async (groceryId: number) => {
  const shortages = await listShortagesFind({ listGroceryId: groceryId })

  for (const shortage of shortages) {
    await listShortageDelete(shortage.id)
  }

  await listGroceryDelete(groceryId)
}
