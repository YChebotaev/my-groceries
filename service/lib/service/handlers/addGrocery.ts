import { listGroceryCreate } from "@my-groceries/persistence"

export const addGrocery = async (listId: number, name: string) => {
  await listGroceryCreate({ listId, name })
}
