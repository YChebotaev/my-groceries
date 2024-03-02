import { listGroceryGet, listShortagesFind } from '@my-groceries/persistence'
import { Shortage } from '../../../types'

export const getListShortages = async (listId: number) => {
  const listShortages = await listShortagesFind({ listId })

  return (await Promise.all(
    listShortages.map(async (shortage) => {
      const grocery = await listGroceryGet(shortage.listGroceryId)

      if (grocery == null) return

      return {
        id: shortage.id,
        name: grocery.name,
        groceryId: grocery.id
      }
    })
  )).filter(shortage => shortage) as Shortage[]
}
