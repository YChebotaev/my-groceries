import { listGroceryGet, listGroceryIsShortage } from "@my-groceries/persistence"
import { Grocery } from '../../../types'

export const getGrocery = async (listId: number, groceryId: number) => {
  const grocery = await listGroceryGet(groceryId)

  if (!grocery) {
    throw new Error(`Cannot find grocery by id = ${groceryId}`)
  }

  return {
    id: grocery.id,
    name: grocery.name,
    shortage: await listGroceryIsShortage(grocery.id)
  } as Grocery
}
