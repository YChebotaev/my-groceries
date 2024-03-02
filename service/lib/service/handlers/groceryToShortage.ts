import { listShortageCreate, listShortagesFind } from '@my-groceries/persistence'

export const groceryToShortage = async (listId: number, listGroceryId: number) => {
  const shortages = await listShortagesFind({ listGroceryId })

  if (shortages.length > 0) return

  await listShortageCreate({ listId, listGroceryId })
}
